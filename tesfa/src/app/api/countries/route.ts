
import { NextRequest } from "next/server";
export async function GET(request:NextRequest) {
  const baseUrl = process.env.BASE_URL
  const authHeader = request.headers.get('authorization');
  if (!authHeader){
    return new Response(JSON.stringify({error: 'Missing authorization token'}),{
      status:401,
      headers:{'Content-Type':'application/json'},
    });
  }
  try{
    const response = await fetch(`${baseUrl}/countries`,{
      headers: {
        Authorization: authHeader,
        'Content-Type':'application/json',
      }
    });
if (!response.ok){
  const errorText = await response.text();
  console.error('API error:', errorText)
  return new Response(JSON.stringify({error:'Failed to fetch'}), {
    status: response.status,
    headers:{'Content-Type':'application/json'},
  })
}

    const result = await response.json();
    console.log('Fetched countries:', result);
    return new Response(JSON.stringify(result),{
      status:200,
    })
  }catch(error){
    return new Response((error as Error).message),{
      status:500
    }
  }
  
}