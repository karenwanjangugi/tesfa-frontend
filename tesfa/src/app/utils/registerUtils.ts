const registerUrl = "/api/register";
function customError(field: string, msg: string): string {

  if (field === "password" && msg.toLowerCase().includes("at least 8 characters")) {
    return "Password must be at least 8 characters long.";
  }

  if (field === "email" && msg.toLowerCase().includes("already exists")) {
    return "Email already exists.";
  }
  const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);
  return `${capitalizedField}: ${msg}`;
}

export async function fetchRegister(userData: object) {
  try {
    const response = await fetch(registerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
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
            msg.forEach(m => errorMsgs.push(customError(field, m)));
          } else if (typeof msg === "string") {
            errorMsgs.push(customError(field, msg));
          }
        }
      } else if (text) {
        errorMsgs.push(text);
      }
      throw new Error(errorMsgs.length > 0 ? errorMsgs.join("\n") : "Registration failed.");
    }
    return result ?? text;
  } catch (error) {
    throw new Error(
      (error as Error).message
    );
  }
}