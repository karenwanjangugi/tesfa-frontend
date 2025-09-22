import { NextRequest } from "next/server";
import { getToken } from "../../../utils/getToken";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = getToken(request);
  const { id } = (await context.params);
  const bodyData = await request.json();
  const { status } = bodyData;

  if (!status) {
    return new Response("Missing status field", {
      status: 400,
    });
  }

  try {
    const response = await fetch(`${baseUrl}/task-assignments/${id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });


    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (error) {
    return new Response((error as Error).message, {
      status: 500,
    });
  }
}
