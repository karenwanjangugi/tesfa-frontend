import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url) {
      return NextResponse.json({ message: "Server misconfigured" }, { status: 500 });
    }

    const res = await fetch(`${url}password-reset-confirm/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    const data = text ? (() => {
      try { return JSON.parse(text); } 
      catch { return { message: text }; }
    })() : {};

    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}