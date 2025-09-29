import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const baseUrl = process.env.BASE_URL;
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing authorization token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(`${baseUrl}/queries`, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Queries API error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to fetch queries' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await response.json();
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Fetch queries error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}