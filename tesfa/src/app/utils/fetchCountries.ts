const baseurl = '/api/countries';

export async function fetchCountries() {
  try {
    const token = localStorage.getItem('Token');
    if (!token) {
      throw new Error('No token found. Please log in.');
    }

    const response = await fetch(baseurl, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Something went wrong, ' + response.statusText);
    }

    const result = await response.json();

    if (!result || (Array.isArray(result) && result.length === 0)) {
      throw new Error('No countries found.');
    }

    return result;

  } catch (error) {
    throw new Error(`Error fetching countries: ${(error as Error).message}`);
  }
}
