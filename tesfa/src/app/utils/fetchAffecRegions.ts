// app/utils/fetchAffectedRegions.ts

export async function fetchAffectedRegions() {
  // Only runs on client
  const token = localStorage.getItem("authToken") 
  

  const res = await fetch("/api/countries", {
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
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch affected regions");
  }

  return res.json();
}