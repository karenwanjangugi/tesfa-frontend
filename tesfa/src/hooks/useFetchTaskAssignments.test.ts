import { renderHook, waitFor, act } from '@testing-library/react';
import { useFetchTaskAssignments } from './useFetchTaskAssignment';
import { TaskStatus } from '@/utils/type';
import { fetchTaskAssignments, updateTaskAssignmentStatus } from '@/utils/fetchtaskAssignment';
import { mapApiTask } from '@/utils/fetchTasks';

process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
process.env.NEXT_PUBLIC_API_TOKEN = 'fake-token';


jest.mock('../utils/fetchtaskAssignment');

jest.mock('../utils/fetchTasks', () => ({
  ...jest.requireActual('../utils/fetchTasks'),
  mapApiTask: jest.fn(),
}));

global.fetch = jest.fn();

describe('useTaskAssignments', () => {
  const mockAssignments = [
    { id: 101, task: 1, status: 'pending' as TaskStatus, organization: 7, created_at: '', updated_at: '' },
    { id: 102, task: 2, status: 'in_progress' as TaskStatus, organization: 7, created_at: '', updated_at: '' },
  ];

  const mockApiTasks = [
    { id: 1, title: 'Task One', description: 'Desc 1', assignments: [{ status: 'pending' }] },
    { id: 2, title: 'Task Two', description: 'Desc 2', assignments: [{ status: 'in_progress' }] },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (fetchTaskAssignments as jest.Mock).mockResolvedValue(mockAssignments);
    (mapApiTask as jest.Mock).mockImplementation((apiTask: any) => Promise.resolve({
      id: String(apiTask.id),
      title: apiTask.title,
      description: apiTask.description,
      status: 'pending', 
    }));

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      const taskId = url.split('/').slice(-2)[0];
      const task = mockApiTasks.find(t => t.id === Number(taskId));
      return Promise.resolve({ ok: true, json: () => Promise.resolve(task) });
    });
  });

  it('fetches and formats tasks with assignments on mount', async () => {
    const { result } = renderHook(() => useFetchTaskAssignments());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.assignedTasks).toEqual([
      {
        id: '1',
        title: 'Task One',
        description: 'Desc 1',
        status: 'pending',
        assignmentId: 101,
      },
      {
        id: '2',
        title: 'Task Two',
        description: 'Desc 2',
        status: 'in_progress',
        assignmentId: 102,
      },
    ]);
  });

  it('updateTaskStatus updates local state when successful', async () => {
    (updateTaskAssignmentStatus as jest.Mock).mockResolvedValue({});
    const { result } = renderHook(() => useFetchTaskAssignments());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.updateTaskStatus('1', 'completed');
    });

    expect(updateTaskAssignmentStatus).toHaveBeenCalledWith(101, 'completed');
    expect(result.current.assignedTasks.find(t => t.id === '1')?.status).toBe('completed');
  });

  it('updateTaskStatus reverts state if API call fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (updateTaskAssignmentStatus as jest.Mock).mockRejectedValue(new Error('Update failed'));

    const { result } = renderHook(() => useFetchTaskAssignments());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.assignedTasks.find(t => t.id === '1')?.status).toBe('pending');

    await act(async () => {
      await result.current.updateTaskStatus('1', 'completed');
    });


    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to update task status, reverting change.', expect.any(Error));
    expect(result.current.assignedTasks.find(t => t.id === '1')?.status).toBe('pending');

    consoleErrorSpy.mockRestore();
  });
});
