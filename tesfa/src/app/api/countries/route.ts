import { NextResponse } from "next/server";
export async function GET() {
  try {
    const res = await fetch(`${process.env.BASE_URL}/countries`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch countries");
    }
    const allCountries = await res.json();
    const affected = allCountries.filter((c: any) => c.is_affected === true);
    return NextResponse.json(affected);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}