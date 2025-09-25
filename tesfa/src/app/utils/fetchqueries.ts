export async function getQueries() {
  const token = typeof window !== "undefined" 
    ? localStorage.getItem("authToken") 
    : null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}queries/`, {
    headers: {
      ...(token && { Authorization: `Token ${token}` }),
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to fetch queries");
  }

  return res.json();
}