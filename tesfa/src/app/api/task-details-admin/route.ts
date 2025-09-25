import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  const headersList = headers();
  const authorization = (await headersList).get("authorization");

  if (!authorization) {
    return NextResponse.json(
      { message: "Authorization header required" },
      { status: 401 }
    );
  }

  const baseUrl = process.env.BASE_URL;

  try {
    const response = await fetch(`${baseUrl}/tasks/`, {
      headers: {
        Authorization: authorization,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
