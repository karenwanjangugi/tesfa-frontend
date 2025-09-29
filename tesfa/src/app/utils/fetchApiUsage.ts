
export async function fetchApiUsageStats() { 
  const response = await fetch('/api/api-usage-stats'); 
  if (!response.ok) {
    throw new Error('Failed to fetch API usage');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}