import { getToken } from './getTokenAdmin'
import { User } from "./type";

export const fetchOrganizationsAdmin = async (): Promise<User[]> =>
{
    const token = getToken();

    if (!token){
        throw new Error('Authentication token not found in local storage')
    }

    const response = await fetch(`/api/organizations-admin`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    });
    if (!response.ok){
        const errorData = await response.json().catch(()=> 
            ({ message: 'Failed to fetch organizations'}));
    throw new Error(errorData.message);
    }
    const data = await response.json();
    return data;
}