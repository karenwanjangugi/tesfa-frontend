
import { getToken } from "./getToken"; 

export async function fetchAffectedCountries() {
  const token = getToken(); 

  if (!token) {
    throw new Error('User is not authenticated');
  }

  const response = await fetch('/api/countries', {
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch countries: ' + response.statusText);
  }

  return response.json();
}