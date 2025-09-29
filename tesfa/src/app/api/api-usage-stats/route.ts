import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });
    }

    const res = await fetch(`http://127.0.0.1:8000/api/api-usage-stats/`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    console.log('Django status:', res.status);
    console.log('Django URL:', res.url);
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Django error response body:', errorText); 
      throw new Error(`Django returned ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Next.js route error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch API usage stats' },
      { status: 500 }
    );
  }
}