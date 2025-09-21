import { ApiTask, Task } from './type';
import { mapApiTask } from "@/utils/fetchTasks";



describe('fetchtasks utilities', () => {

  describe('mapApiTask', () => {
    const baseApiTask: ApiTask = {
      id: 123,
      title: 'Test Task',
      description: 'Test Description',
      assignments: []
    };

    it('maps a task with no assignments to a status of "pending"', async () => {
      const result = await mapApiTask({ ...baseApiTask, assignments: [] });

      const expected: Task = {
        id: '123',
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
      };

      expect(result).toEqual(expected);
    });

    it('maps a task with a "completed" assignment status to "completed"', async () => {
      const apiTask: ApiTask = {
        ...baseApiTask,
        assignments: [{ status: 'completed' }],
      };
      const result = await mapApiTask(apiTask);
      expect(result.status).toBe('completed');
    });

    it('maps a task with a "pending" assignment status to "pending"', async () => {
      const apiTask: ApiTask = {
        ...baseApiTask,
        assignments: [{ status: 'pending' }],
      };
      const result = await mapApiTask(apiTask);
      expect(result.status).toBe('pending');
    });

    it('maps a task with an "in_progress" assignment status to "in_progress"', async () => {
      const apiTask: ApiTask = {
        ...baseApiTask,
        assignments: [{ status: 'in_progress' }],
      };
      const result = await mapApiTask(apiTask);
      expect(result.status).toBe('in_progress');
    });

    it('uses the first assignment if multiple exist', async () => {
      const apiTask: ApiTask = {
        ...baseApiTask,
        assignments: [
          { status: 'in_progress' },
          { status: 'completed' },
        ],
      };
      const result = await mapApiTask(apiTask);
      expect(result.status).toBe('in_progress');
    });

     it('handles a missing assignments array by defaulting to pending', async () => {
      const apiTaskWithNoAssignments = {
        id: 456,
        title: 'Another Task',
        description: 'No assignments array',
        status: 'pending',
      } as Omit<ApiTask, 'assignments'>;

      const result = await mapApiTask(apiTaskWithNoAssignments as ApiTask);
      expect(result.status).toBe('pending');
    });
  });
});
