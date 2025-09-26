
export async function GET(request: Request) {
  const baseUrl = process.env.BASE_URL;

  if (!baseUrl) {
    return new Response(JSON.stringify({ error: "Backend URL not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const authHeader = request.headers.get("Authorization");

  try {
    const response = await fetch(`${baseUrl}/countries`, {
      cache: "no-store",
      headers: {
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: "Failed to fetch regions", detail: errorText }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const regions = await response.json();
    const affected = regions.filter((region: any) => region.is_affected === true);

    return new Response(JSON.stringify(affected), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}