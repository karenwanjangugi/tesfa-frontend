import { useEffect, useState } from "react"
import { TaskAssignment } from "../utils/type";
import { fetchTasksAssignmentsAdmin } from "../utils/fetchTaskAssignment";



export const useFetchTasks = () =>{
  const [tasks, setTasks] = useState<TaskAssignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() =>{
    const getTasks = async () =>{
      try{
        setLoading(true);
        const tasksData = await fetchTasksAssignmentsAdmin();
        setTasks(tasksData);
      } catch (error){
        setError (error as Error);
      } finally {
        setLoading(false);
      }
    };
    getTasks();
  }, [])
  return { tasks, loading, error };
}




























