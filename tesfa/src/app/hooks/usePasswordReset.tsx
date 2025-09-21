import { useState } from "react";
import { fetchPasswordReset } from "../utils/fetchPassworReset";
export function usePasswordReset() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestReset = async (email: string) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetchPasswordReset({ email });
      setMessage(res.message || "Password reset link sent!");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return { loading, message, error, requestReset };
}