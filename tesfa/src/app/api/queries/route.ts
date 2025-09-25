// import { NextResponse } from "next/server";
// export async function GET() {
//   try {
//     const res = await fetch(`${process.env.BASE_URL}queries`, {
//       cache: "no-store",
//     });
//     if (!res.ok) {
//       throw new Error("Failed to fetch queries");
//     }
//     const data = await res.json();
//     return NextResponse.json(data);
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get("year");
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/queries/${
        year ? `?year=${year}` : ""
      }`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch queries");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}