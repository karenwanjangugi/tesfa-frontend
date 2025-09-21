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
      const res = await fetchPasswordResetConfirm(payload);
      setMessage(res.message || "Password reset successful");
      return res;
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { loading, error, message, confirmReset };
}


