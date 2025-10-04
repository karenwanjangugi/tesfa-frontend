export async function fetchPredictions() {
  
  const token = localStorage.getItem('Token'); 
  if (!token) {
    throw new Error('No token found. Please set token in localStorage first.');
  }

  try {
    const response = await fetch('/api/prediction', {
      headers: {
        Authorization: `Token ${token}`, 
      },
    });

    if (!response.ok) {
      throw new Error('Something went wrong: ' + response.statusText);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(`Error fetching predictions: ${(error as Error).message}`);
  }
}