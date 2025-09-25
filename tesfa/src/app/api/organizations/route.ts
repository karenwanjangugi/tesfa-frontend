

import { NextRequest, NextResponse } from "next/server";


const baseUrl = process.env.BASE_URL;


export async function GET(request: NextRequest) {
 try {
   const token = request.headers.get("authorization")?.split(" ")[1] || "";
   if (!baseUrl) {
     return NextResponse.json({ error: "BASE_URL env variable is not set" }, { status: 500 });
   }
   const response = await fetch(`${baseUrl}/users/`, {
     headers: token ? { Authorization: `Token ${token}` } : {},
   });


   let result;
   try {
     result = await response.json();
   } catch (jsonError) {
     return NextResponse.json({ error: "Invalid JSON from backend" }, { status: 502 });
   }


   if (!response.ok) {
     return NextResponse.json({ error: result.error || "Failed to fetch users" }, { status: response.status });
   }


   return NextResponse.json(result, { status: 200 });
 } catch (error) {
   return NextResponse.json({ error: (error as Error).message }, { status: 400 });
 }
}