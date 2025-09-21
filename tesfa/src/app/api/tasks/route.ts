export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${baseUrl}/tasks/`, {
      headers: {
        Authorization: `Token ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
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
