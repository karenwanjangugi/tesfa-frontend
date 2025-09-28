export async function fetchRegions() {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called in the browser');
  }

  const token = localStorage.getItem('Token');

  if (!token) {
    throw new Error('No token found. Please set token in localStorage.');
  }

  try {
    const response = await fetch('/api/regions', {
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
    throw new Error(`Error fetching regions: ${(error as Error).message}`);
  }
}