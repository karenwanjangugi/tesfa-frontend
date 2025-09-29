export async function fetchApiUsageStats(token: string) {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  const response = await fetch('/api/api-usage-stats', {
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}