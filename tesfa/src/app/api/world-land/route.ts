export async function GET() {
  const worldLand = process.env.WORLD_LAND;

  if (!worldLand) {
    return new Response(
      JSON.stringify({ error: 'WORLD_LAND URL not defined' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }

  try {
    const response = await fetch(`${worldLand}/naturalearth-3.3.0/ne_110m_land.geojson`);

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: `Failed to fetch GeoJSON: ${response.status} ${errorText}` }),
        { status: response.status, headers: { 'content-type': 'application/json' } }
      );
    }

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message || 'Internal server error' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}
