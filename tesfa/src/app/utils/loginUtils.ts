const loginUrl = "/api/login";
export async function fetchLogin(credentials: object) {
  try {
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const text = await response.text();
    let result: any = null;
    try {
      result = JSON.parse(text);
    } catch {
      result = null;
    }
    if (!response.ok) {
      let errorMsgs: string[] = [];
      if (result && typeof result === "object") {
        if (result.detail) errorMsgs.push(result.detail);
        if (Array.isArray(result.non_field_errors)) errorMsgs.push(...result.non_field_errors);
        for (const [field, msg] of Object.entries(result)) {
          if (field === "detail" || field === "non_field_errors") continue;
          if (Array.isArray(msg)) {
            msg.forEach(m => errorMsgs.push(`${field}: ${m}`));
          } else if (typeof msg === "string") {
            errorMsgs.push(`${field}: ${msg}`);
          }
        }
      } else if (text) {
        errorMsgs.push(text);
      }
      throw new Error(errorMsgs.length > 0 ? errorMsgs.join("\n") : "Login failed.");
    }
    if (result.token && result.user_id) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user_id", result.user_id.toString());
    }
    return result ?? text;
  } catch (error) {
    throw new Error("Failed to login: " + (error instanceof Error ? error.message : String(error)));
  }
}
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");
}