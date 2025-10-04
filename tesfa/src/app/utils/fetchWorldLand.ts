const baseurl = '/api/world-land';

export async function fetchWorldLand() {
  try {
    const response = await fetch(baseurl);
    if (!response.ok) {
      throw new Error('Something went wrong, ' + response.statusText);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(`Error fetching world land: ${(error as Error).message}`);
  }
}
