import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const body = await req.json();
  const backend = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${backend}password-reset-confirm/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data = text ? JSON.parse(text) : {};
try {
  data = text ? JSON.parse(text) : {};
} catch {
  data = { message: "Invalid response format from server." };
}
 return NextResponse.json(data, { status: res.status });
}