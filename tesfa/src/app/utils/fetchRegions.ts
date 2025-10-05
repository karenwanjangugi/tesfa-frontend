const baseurl = '/api/regions';

export async function fetchRegions() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found. Please set token in localStorage.');
    }

    const response = await fetch(baseurl, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Something went wrong: ' + response.statusText);
    }

    const result = await response.json();

    if (!result || (Array.isArray(result) && result.length === 0)) {
      throw new Error('No regions found.');
    }

    return result;
  } catch (error) {
    throw new Error(`Error fetching regions: ${(error as Error).message}`);
  }
}
