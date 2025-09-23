import { NextRequest } from "next/server";

export const getToken = (request: NextRequest) => {
  const authorization = request.headers.get("Authorization");
  if (authorization && authorization.startsWith("Token ")) {
    return authorization.substring(6);
  }
  return null;
};

export const getTokenFromLocalStorage = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};
