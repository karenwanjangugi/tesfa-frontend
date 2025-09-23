import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.BASE_URL 

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) throw new Error("userId required");

    const response = await fetch(`${baseUrl}users/${userId}`, {
      headers: token ? { Authorization: `Token ${token}` } : {},
    });

    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) throw new Error("userId required");

    const contentType = request.headers.get("content-type") || "";
    let bodyData;
    if (contentType.includes("multipart/form-data")) {
      bodyData = await request.formData();
    } else {
      bodyData = await request.json();
    }

    const response = await fetch(`${baseUrl}users/${userId}/`, {
      method: "PUT",
      headers: {
        ...(token ? { Authorization: `Token ${token}` } : {}),
        ...(contentType.includes("multipart/form-data") ? {} : { "Content-Type": contentType }),
      },
      body: bodyData,
    });

    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
