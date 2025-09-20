"use client";
import { useState } from "react";
import { post } from "../utils/fetchPassword";

export function usePasswordResetConfirm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function confirmReset(payload: Record<string, any>) {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await post("password-reset-confirm/", payload); 
      setMessage(res.message || "Password reset successful.");
      return res;
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, message, confirmReset };
}