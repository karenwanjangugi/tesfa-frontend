import { useQuery } from '@tanstack/react-query';
import { mapApiTask, fetchTasks } from '../utils/fetchTasks';
import { fetchTaskAssignments } from '../utils/fetchTaskAssignment';
import { Task } from '../utils/type';

export const useFetchTasks = () => {
  const {
    data: tasks,
    isLoading,
    error,
    refetch,
  } = useQuery<Task[]>({
    queryKey: ['unassignedTasks'],
    queryFn: async () => {
      const assignments = await fetchTaskAssignments();
      const assignedTaskIds = new Set(
        assignments.map((assignment) => assignment.task.toString())
      );

      const data = await fetchTasks();
      const allFormattedTasks = await Promise.all(data.map(mapApiTask));
      const unassignedTasks = allFormattedTasks.filter(
        (task) => !assignedTaskIds.has(task.id)
      );

      return unassignedTasks;
    },
    refetchInterval: 10000, 
    staleTime: 5000 * 60 * 5, 
    gcTime: 1000 * 60 * 60,
  });

  return {
    tasks: tasks || [], 
    loading: isLoading, 
    error,
    refetch, 
  };
};
