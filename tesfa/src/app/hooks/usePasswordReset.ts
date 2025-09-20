"use client";
import { useState } from "react";
import { post } from "../utils/fetchPassword"; 

export function usePasswordReset() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestReset = async (email: string) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await post("/password-reset/", { email }); 
      setMessage(res.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, message, error, requestReset };
}