import { NextRequest } from "next/server";
import { getToken } from "../../../utils/getToken";

export async function GET(request: NextRequest, context: { params: Promise<{ id:string }> }) {
    const { id } = (await context.params);
    const baseUrl = process.env.BASE_URL;
    const token = getToken(request);
    
    if (!token) {
     return new Response("Unauthorized", { status: 401 });
       }

  try {
      const response = await fetch(`${baseUrl}/tasks/${id}`,{
        headers: {
            'Authorization': `Token ${token}`
        }
      });


    const result = await response.json();
  
    return new Response(JSON.stringify(result),
      {
         status: 200,
     });
  } catch (error) {
    return new Response((error as Error).
      message, {
           status: 500,
    })}
  }
