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
  const url = `${baseUrl}countries/`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: `API: ${response.status} ${errorText}` }),
        { status: response.status }
      );
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

