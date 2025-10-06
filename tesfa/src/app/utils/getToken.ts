import { NextRequest } from "next/server";

export const getToken = (request?: NextRequest): string | null => {
  if (request) {
    const authorization = request.headers.get("Authorization");
    if (authorization && authorization.startsWith("Token ")) {
      return authorization.substring(6);
    }
    return null;
  }

  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }

  return null;
};
