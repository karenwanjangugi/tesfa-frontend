const baseUrl = process.env.BASE_URL;
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body) {
      return new Response(
        JSON.stringify({ error: "Request body is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const response = await fetch(`${baseUrl}/users/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    let result: any = null;
    try {
      result = JSON.parse(text);
    } catch {
      result = text;
    }
    if (!response.ok) {
      
      return new Response(JSON.stringify(result), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }
  
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {

    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}