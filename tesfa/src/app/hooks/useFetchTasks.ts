 import { useState, useEffect } from 'react';
import { mapApiTask, fetchTasks } from '../utils/fetchTasks';
import { fetchTaskAssignments } from '../utils/fetchTaskAssignment';
import { Task } from '../utils/type';

export const useFetchTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
 
   useEffect(() => {
     const fetchUnassignedTasks = async () => {
       setLoading(true);
       try {
         const assignments = await fetchTaskAssignments();
         const assignedTaskIds = new Set(assignments.map(assignment => assignment.task.toString()));
 
         const data = await fetchTasks();
         const allformattedTasks = await Promise.all(data.map(mapApiTask));
 
         const unassignedTasks = allformattedTasks.filter(task => !assignedTaskIds.has(task.id));
         setTasks(unassignedTasks);
       } catch (error) {
         setError(error as Error);
       } finally {
         setLoading(false);
       }
     };
 
     fetchUnassignedTasks();
   }, []);
 
   return { tasks, setTasks, loading, error };
 };