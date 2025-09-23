
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
      const response = await fetchPasswordReset({ email });
      setMessage(response.message);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, message, error, requestReset };
}
