import { NextResponse } from "next/server";
export async function GET() {
  try {
    const res = await fetch(`${process.env.BASE_URL}/users`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch organizations");
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}