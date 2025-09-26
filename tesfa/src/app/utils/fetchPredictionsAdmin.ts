import { Prediction } from "./type";
import { getToken } from './getToken';

export const fetchPredictionsAdmin = async (): Promise<Prediction[]> => {
    const token = getToken();
    const response = await fetch('/api/predictions-admin',{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token? `Token ${token}`: ''
        }
});

    if(!response.ok){
        throw new Error('failed to fetch predictions from API')
    }

    const data = await response.json();
    
  return data
}