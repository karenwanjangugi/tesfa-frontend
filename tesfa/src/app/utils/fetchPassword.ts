export async function post(path: string, data: Record<string, any>) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in environment variables");
}
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_BASE}${normalizedPath}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = "Something went wrong";
    try {
      const json = JSON.parse(errorText);
      errorMessage = json.message || json.detail || errorText;
    } catch {
      errorMessage = errorText || res.statusText;
    }
    throw new Error(errorMessage);
  }

  return res.json(); 
}