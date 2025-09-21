import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}password-reset/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
    let data;
    try {
      data = await res.json();
    } catch {
      data = { message: await res.text() || "Unknown error" };
    }

    return NextResponse.json(data, { status: res.status });
}


