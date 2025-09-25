import { TaskAssignment } from "./type";
import { getToken } from './getTokenAdmin';

export const fetchTasksAssignmentsAdmin = async(): Promise<TaskAssignment[]> =>{
  const token = getToken();
  const response = await fetch('/api/tasks-assignments-admin',{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token? `Token ${token}`: ''
    }
  });

  if(!response.ok){
    throw new Error('Failed to fetch tsks from API')
  }

  const data = await response.json();
  return data

}