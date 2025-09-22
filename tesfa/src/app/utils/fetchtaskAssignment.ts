import { TaskStatus } from './type';
import { TaskAssignment } from './type';

export const fetchTaskAssignments = async (): Promise<TaskAssignment[]> => {
    const response = await fetch('/api/task-assignments/');
    if (!response.ok){
        throw new Error('failed to fetch task assignments from API')
    }
    return response.json();

}

export const updateTaskAssignmentStatus = async (id:number, status:TaskStatus): Promise<TaskAssignment> => {
    const response = await fetch(`/api/task-assignments/${id}/`,{
        method: 'PATCH',
        headers: {'Content-Type': 'Authorization'},
        body: JSON.stringify({ status })
    })

    if (!response.ok){
        throw new Error('Failed to update task assignment status')
    }

    return response.json();
}



export async function createTaskAssignment(task: string, organization: number) {
    const response = await fetch('/api/task-assignments', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ task, organization }),
    });
    if (!response.ok) {
      throw new Error('Failed to create task assignment');
    }
    return response.json();
  }

export const deleteTaskAssignment = async (assignmentId: number): Promise<void> =>{
    const response = await fetch(`/api/task-assignments?assignmentId=${assignmentId}`,{
        method: 'DELETE',
    });
    if (!response.ok){
        throw new Error('Failed to delete task assignment')
    }

}