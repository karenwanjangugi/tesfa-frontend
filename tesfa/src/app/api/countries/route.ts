
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const baseUrl = process.env.BASE_URL;

  if (!baseUrl) {
    console.error('Missing BASE_URL');
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Token ')) {
    return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
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

    console.log(`Fetched ${url} Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('External API Error:', errorText);
      return NextResponse.json(
        { error: `External API: ${response.status} ${errorText}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Expected JSON but got:', text);
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Unhandled Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}