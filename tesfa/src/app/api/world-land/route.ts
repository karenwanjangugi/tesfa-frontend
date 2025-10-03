export async function GET() {
  const worldLand= process.env.WORLD_LAND; 
  if (!worldLand) {
    return new Response('BASE_URL is not defined', { status: 500 });
  }
  try {
    const response = await fetch(`${worldLand}/naturalearth-3.3.0/ne_110m_land.geojson`);
    if (!response.ok) {
      throw new Error('Failed to fetch GeoJSON');
    }
    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}
