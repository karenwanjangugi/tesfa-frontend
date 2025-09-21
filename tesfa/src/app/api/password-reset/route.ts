// import { NextResponse } from "next/server";
// export async function POST(req: Request) {
//   const body = await req.json();
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}password-reset/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   });
//   const data = await res.json();
//   return NextResponse.json(data, { status: res.status });
// }


import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
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

  } catch (error: any) {
    console.error("Password reset API route error:", error);

    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}