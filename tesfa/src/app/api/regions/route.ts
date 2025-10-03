
import { NextRequest } from 'next/server';
export async function GET(request: NextRequest) {
  const baseUrl = process.env.BASE_URL;

  if (!baseUrl) {
    return new Response(
      JSON.stringify({ error: 'Server misconfigured' }),
      { status: 500 }
    );
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Token ')) {
    return new Response(
      JSON.stringify({ error: 'Missing or invalid token' }),
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const response = await fetch(`${baseUrl}regions/`, {
      headers: {
        Authorization: `Token ${token}`, 
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return new Response(JSON.stringify(result), { status: 200 });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 }
    );
  }
}
