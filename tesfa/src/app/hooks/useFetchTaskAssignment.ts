import { useState, useEffect, useCallback } from "react";
import { Task, ApiTask } from "../utils/type";
import { fetchTaskAssignments, updateTaskAssignmentStatus } from "../utils/fetchtaskAssignment";
import { TaskStatus } from '../utils/type'; 
import { mapApiTask } from "../utils/fetchTasks";


export const useFetchTaskAssignments = () => {
    const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const getAssignedTasks = async () => {
            setLoading(true);
            try {
                const assignments = await fetchTaskAssignments();

                if (!assignments || assignments.length === 0) {
                    setLoading(false);
                    return;
                    }


                const taskPromises = assignments.map(assignment =>
                    fetch(`api/tasks/${assignment.task}/`).then(response =>{
                        if (!response.ok) {
                            console.error(`Failed to fetch task ${assignment.task}`, response);
                            throw new Error(`Failed to fetch task ${assignment.task}`);
                           }
                           return response.json()
                    } 
                    )
                );
       
                const tasksData: ApiTask[] = await Promise.all(taskPromises);
                
                
                const formattedTasks = await Promise.all(tasksData.map(mapApiTask))
   
                
                const tasksWithAssignments = formattedTasks.map(task =>{
                    const assignment = assignments.find(a => a.task === parseInt(task.id));
                    return{
                        ...task, assignmentId: assignment? assignment.id: undefined,
                        status: assignment? assignment.status: 'pending'
                    }
                })
      

                setAssignedTasks(tasksWithAssignments);
            } catch (err){
                console.error("An error occurred during the fetching process:", err);
                setError(err as Error)
            } finally {
                setLoading(false)
                      }
        }
        getAssignedTasks()}, [])
                
 const updateTaskStatus = useCallback (async (taskId: string, newStatus: TaskStatus) => {
    const task = assignedTasks.find(t => t.id === taskId)
    if (task && task.assignmentId){
        try {
            await updateTaskAssignmentStatus(task.assignmentId, newStatus)
            setAssignedTasks(prevTasks =>
                prevTasks.map(t =>
                    t.id === taskId ? {...t, status: newStatus} : t
                )
            )
            
        } catch (error) {
            console.error("Failed to update task status, reverting change." ,error)
        }
    }
 }, [assignedTasks])

 return { assignedTasks, setAssignedTasks, loading, error, updateTaskStatus}


};