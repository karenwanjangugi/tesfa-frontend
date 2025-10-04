import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
   const baseUrl = process.env.BASE_URL;
  try {
    const res = await fetch(`${baseUrl}/api-usage-stats/`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Django error:', errorText);
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Route error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}