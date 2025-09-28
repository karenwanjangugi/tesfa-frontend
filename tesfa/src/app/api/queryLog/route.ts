
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const baseUrl = process.env.BASE_URL;

  if (!baseUrl) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Token ')) {
    return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];

  const targetUrl = baseUrl.endsWith('/') ? `${baseUrl}queries/` : `${baseUrl}/queries/`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET', 
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('GET /api/queryLog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const baseUrl = process.env.BASE_URL;

  if (!baseUrl) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Token ')) {
    return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];

  const targetUrl = baseUrl.endsWith('/') ? `${baseUrl}queries/` : `${baseUrl}/queries/`;

  try {
    const body = await request.json();
    console.log('Sending to backend:', JSON.stringify(body));

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`, 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('Backend status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Backend error:', errorText);
      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('POST /api/queryLog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}