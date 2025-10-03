const loginUrl = "/api/login";

export async function fetchLogin(credentials: object) {
  try {
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed: " + response.statusText);
    }

    const result = await response.json();

    if (result.token && result.user_id) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user_id", result.user_id.toString());
    }

    return result;
  } catch (error) {
    throw new Error("Failed to login: " + (error as Error).message);
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user_id"); 
  }
