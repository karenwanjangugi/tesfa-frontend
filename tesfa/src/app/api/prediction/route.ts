
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

  try {
    const response = await fetch(`${baseUrl}predictions/`, {
      headers: {
        Authorization: `Token ${token}`, 
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('External API Error:', errorText);
      return NextResponse.json(
        { error: `External API: ${response.status} ${errorText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}