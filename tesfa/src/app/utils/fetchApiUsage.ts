const baseUrl = '/api/api-usage-stats';

export async function fetchApiUsageStats() {
  try {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch API usage: ' + response.statusText);
    }
    const result = await response.json();
    return Array.isArray(result) ? result : [];
  } catch (error) {
    throw new Error(`Error fetching API usage stats: ${(error as Error).message}`);
  }
}