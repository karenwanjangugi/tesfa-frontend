const baseUrl = process.env.BASE_URL;
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { org_name, email, password, password2, role } = body;
    if (!org_name || !email || !password || !password2) {
      return new Response(
        JSON.stringify({ error: "Missing required values: org_name, email, password, password2" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const response = await fetch(`${baseUrl}/users/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ org_name, email, password, password2, role }),
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
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}