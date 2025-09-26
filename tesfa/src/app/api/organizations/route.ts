import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.BASE_URL;

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!baseUrl) {
      return NextResponse.json({ error: "BASE_URL env variable is not set" }, { status: 500 });
    }
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let response;
    if (userId) {
      response = await fetch(`${baseUrl}/users/${userId}`, {
        headers: token ? { Authorization: `Token ${token}` } : {},
      });
    } else {
      response = await fetch(`${baseUrl}/users/`, {
        headers: token ? { Authorization: `Token ${token}` } : {},
      });
    }

    let result;
    try {
      result = await response.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON from backend" }, { status: 502 });
    }

    if (!response.ok) {
      return NextResponse.json({ error: result.error || "Failed to fetch users" }, { status: response.status });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!baseUrl) {
      return NextResponse.json({ error: "BASE_URL env variable is not set" }, { status: 500 });
    }

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

    const response = await fetch(`${baseUrl}/users/${userId}/`, {
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
