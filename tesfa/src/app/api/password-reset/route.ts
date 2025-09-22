import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const body = await req.json();
  const response = await fetch(`${process.env.BASE_URL}password-reset/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
    let data;
    try {
      data = await response.json();
    } catch (error) {
      data =  (error as Error ).message || "Opps something went wrong"; 
    }

    return NextResponse.json(data, { status: response.status });
}
