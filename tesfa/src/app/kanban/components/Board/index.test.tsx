import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import  KanbanBoard  from './index';
import { useFetchTaskAssignments } from '../../../hooks/useFetchTaskAssignment';
import { deleteTaskAssignment } from '../../../utils/fetchTaskAssignment';

jest.mock('../Taskcard', () => ({
  TaskCard: ({ task, onDelete }: { task: any; onDelete: any }) => (
    <div data-testid={`task-${task.id}`}>
      <span>{task.title}</span>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  ),
}));
jest.mock('../Dropzone', () => ({
  DropZone: ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div data-testid={`dropzone-${id}`}>{children}</div>
  ),
}));

jest.mock('framer-motion', () => ({
  motion: { div: ({ children, ...props }: any) => <div {...props}>{children}</div> },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));
jest.mock('next/navigation');

jest.mock('../../../hooks/useFetchTaskAssignment');
jest.mock('../../../utils/fetchTaskAssignment');


jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DragOverlay: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useSensor: jest.fn(),
  useSensors: jest.fn(),
  PointerSensor: jest.fn(),
  closestCenter: jest.fn(),
}));

describe('KanbanBoard', () => {
  const mockUseRouter = useRouter as jest.Mock;
  const mockUseSearchParams = useSearchParams as jest.Mock;
  const mockUseTaskAssignments = useFetchTaskAssignments as jest.Mock;
  const mockDeleteTaskAssignment = deleteTaskAssignment as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: jest.fn(), replace: jest.fn() });
    mockUseSearchParams.mockReturnValue({ get: jest.fn().mockReturnValue(null) });
  });

  it('renders loading state', () => {
    mockUseTaskAssignments.mockReturnValue({ loading: true, assignedTasks: [], error: null });
    render(<KanbanBoard />);
    expect(screen.getByText(/Loading board.../i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseTaskAssignments.mockReturnValue({ loading: false, assignedTasks: [], error: new Error('fail') });
    render(<KanbanBoard />);
    expect(screen.getByText(/Something went Wrong/i)).toBeInTheDocument();
  });

  it('renders tasks in correct columns', () => {
    mockUseTaskAssignments.mockReturnValue({
      loading: false,
      error: null,
      assignedTasks: [
        { id: '1', title: 'Task 1', status: 'pending', assignmentId: 1 },
        { id: '2', title: 'Task 2', status: 'in_progress', assignmentId: 2 },
      ],
    });
    render(<KanbanBoard />);
    expect(within(screen.getByTestId('dropzone-pending')).getByText('Task 1')).toBeInTheDocument();
    expect(within(screen.getByTestId('dropzone-in_progress')).getByText('Task 2')).toBeInTheDocument();
  });

  it('handles task deletion', async () => {
    mockUseTaskAssignments.mockReturnValue({
      loading: false,
      error: null,
      setAssignedTasks: jest.fn(),
      assignedTasks: [{ id: '1', title: 'Task 1', status: 'pending', assignmentId: 1 }],
    });
    mockDeleteTaskAssignment.mockResolvedValue(undefined);

    render(<KanbanBoard />);

    const task1 = screen.getByTestId('task-1');
    const deleteButton = within(task1).getByRole('button', { name: /delete/i });
    
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteTaskAssignment).toHaveBeenCalledWith(1);
    });
    await waitFor(() => {
        expect(mockUseTaskAssignments().setAssignedTasks).toHaveBeenCalled();
    });
  });
});
