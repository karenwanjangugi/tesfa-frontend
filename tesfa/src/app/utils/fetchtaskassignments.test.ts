import {
    fetchTaskAssignments,
    updateTaskAssignmentStatus,
    createTaskAssignment,
    deleteTaskAssignment,
  } from './fetchtaskAssignment';
  import { TaskStatus } from './type';



  process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
  process.env.NEXT_PUBLIC_API_TOKEN = 'fake-token';


  global.fetch = jest.fn();

  describe('fetchtaskAssignment utilities', () => {
    const mockAssignment = {
      id: 101,
      task: 1,
      organization: 7,
      status: 'pending' as TaskStatus,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    };

    beforeEach(() => {
      (global.fetch as jest.Mock).mockClear();
    });

    describe('fetchTaskAssignments', () => {
      it('fetches assignments successfully', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([mockAssignment]),
        });

        const result = await fetchTaskAssignments();

        expect(global.fetch).toHaveBeenCalledWith('/api/task-assignments/',{"headers":{}});
        expect(result).toEqual([mockAssignment]);
      });

      it('throws an error on non-ok response', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
        await expect(fetchTaskAssignments()).rejects.toThrow('failed to fetch task assignments from API');
      });
    });

    describe('updateTaskAssignmentStatus', () => {
      it('updates status with a PATCH request', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ ...mockAssignment, status: 'completed' }),
        });

        const result = await updateTaskAssignmentStatus(101, 'completed');

        expect(global.fetch).toHaveBeenCalledWith(
          '/api/task-assignments/101/',
          expect.objectContaining({
            method: 'PATCH',
            body: JSON.stringify({ status: 'completed' }),
          })
        );
        expect(result.status).toBe('completed');
      });

       it('throws an error on non-ok response', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
        await expect(updateTaskAssignmentStatus(101, 'completed')).rejects.toThrow('Failed to update task assignment status');
      });
    });

    describe('createTaskAssignment', () => {
      it('creates an assignment with a POST request', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockAssignment),
        });

        await createTaskAssignment('1', 7);

        expect(global.fetch).toHaveBeenCalledWith(
          '/api/task-assignments',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ task: '1', organization: 7 }),
          })
        );
      });

      it('throws an error on non-ok response', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({error: 'validation error'})
        });
        await expect(createTaskAssignment('1', 7)).rejects.toThrow('Failed to create task assignment');
        consoleErrorSpy.mockRestore();
      });
    });

    describe('deleteTaskAssignment', () => {
      it('deletes an assignment with a DELETE request', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

        await deleteTaskAssignment(101);

        expect(global.fetch).toHaveBeenCalledWith(
          `/api/task-assignments?assignmentId=${101}`,
          expect.objectContaining({ method: 'DELETE' })
        );
      });

      it('throws an error on non-ok response', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
        await expect(deleteTaskAssignment(101)).rejects.toThrow('Failed to delete task assignment');
      });
    });
  });