import { useState } from "react";
import { fetchPasswordResetConfirm } from "../utils/fetchPasswordResetConfirm";

export default function usePasswordResetConfirm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const confirmReset = async (payload: {
    uidb64: string;
    token: string;
    new_password: string;
    confirm_password: string;
  }) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetchPasswordResetConfirm(payload);
      setMessage(response.message);
      return response;
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, message, confirmReset, setError };
}
