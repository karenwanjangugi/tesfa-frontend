"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Task, ApiTask, TaskStatus } from "../utils/type";
import {
  fetchTaskAssignments,
  updateTaskAssignmentStatus,
  deleteTaskAssignment,
} from "../utils/fetchTaskAssignment";
import { mapApiTask, fetchTasksForAssignments } from "../utils/fetchTasks";
import { getToken } from "../utils/getToken";

export const useFetchTaskAssignments = () => {
  const queryClient = useQueryClient();

  const { data: assignedTasks, isLoading: loading, error } = useQuery<Task[]>({
    queryKey: ["taskAssignments"],
    queryFn: async () => {
      const assignments = await fetchTaskAssignments();
      if (!assignments || assignments.length === 0) {
        return [];
      }

      const token = getToken();
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Token ${token}`;
      }
      const taskPromises = fetchTasksForAssignments(assignments, headers);
      const tasksData: ApiTask[] = await Promise.all(taskPromises);
      const formattedTasks = await Promise.all(tasksData.map(mapApiTask));
      const tasksWithAssignments = formattedTasks.map((task) => {
        const assignment = assignments.find(
          (a) => a.task.toString() === task.id
        );
        return {
          ...task,
          assignmentId: assignment ? assignment.id : undefined,
          status: assignment ? assignment.status : "pending",
        };
      });
      return tasksWithAssignments;
    },
  });

    const { mutateAsync: updateTaskStatus } = useMutation({
      mutationFn: ({ taskId, newStatus }: { taskId: string; newStatus: TaskStatus }) => {
        const task = assignedTasks?.find((t) => t.id === taskId);
        if (!task || !task.assignmentId) {
          throw new Error("Task or assignmentId not found for mutation.");
        }
        return updateTaskAssignmentStatus(task.assignmentId, newStatus);
      },
      onMutate: async ({ taskId, newStatus }) => {
        await queryClient.cancelQueries({ queryKey: ["taskAssignments"] });
        const previousTasks = queryClient.getQueryData<Task[]>(["taskAssignments"]);
        queryClient.setQueryData<Task[]>(["taskAssignments"], (oldTasks = []) =>
          oldTasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
        return { previousTasks };
      },
      onError: (err, variables, context) => {
        if (context?.previousTasks) {
          queryClient.setQueryData(["taskAssignments"], context.previousTasks);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["taskAssignments"] });
      },
    });
  
    const { mutateAsync: deleteTask } = useMutation({
      mutationFn: (assignmentId: number) => deleteTaskAssignment(assignmentId),
      onMutate: async (assignmentId) => {
        await queryClient.cancelQueries({ queryKey: ["taskAssignments"] });
        const previousTasks = queryClient.getQueryData<Task[]>(["taskAssignments"]);
        queryClient.setQueryData<Task[]>(["taskAssignments"], (oldTasks = []) =>
          oldTasks.filter((task) => task.assignmentId !== assignmentId)
        );
        return { previousTasks };
      },
      onError: (err, variables, context) => {
        if (context?.previousTasks) {
          queryClient.setQueryData(["taskAssignments"], context.previousTasks);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["taskAssignments"] });
      },
    });
  return {
    assignedTasks: assignedTasks || [],
    loading,
    error,
    updateTaskStatus,
    deleteTask,
  };
};