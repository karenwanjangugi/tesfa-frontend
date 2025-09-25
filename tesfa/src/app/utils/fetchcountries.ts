export async function getCountries() {
  const token = typeof window !== "undefined" 
    ? localStorage.getItem("authToken") 
    : null;

  const res = await fetch(`${process.env.BASE_URL}/countries/`, {
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
    throw new Error("Failed to fetch countries");
  }

  return res.json();
}