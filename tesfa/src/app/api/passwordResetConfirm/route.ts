import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const body = await req.json();
  const backend = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${backend}/password-reset-confirm/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  return NextResponse.json(data, { status: res.status });
}