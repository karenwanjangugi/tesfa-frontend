export async function fetchCountries() {
  const token = localStorage.getItem('Token');

  if (!token) {
    throw new Error('No token found in localStorage. Please log in.');
  }

  const response = await fetch('/api/countries', {
    headers: {
      Authorization: `Token ${token}`, 
    },
  });

  if (!response.ok) {
    throw new Error('Something went wrong: ' + response.statusText);
  }

  const result = await response.json();
  return result;
}