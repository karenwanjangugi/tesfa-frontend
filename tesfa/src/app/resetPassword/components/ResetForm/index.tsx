"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { usePasswordResetConfirm } from "@/app/hooks/usePasswordConfirm";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";


export default function ResetFormClient({ uid, token }: { uid: string; token: string }) {
  const router = useRouter();
  const { loading, error, message, confirmReset } = usePasswordResetConfirm();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (password.length < 8) {
      setLocalError("Must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setLocalError("Passwords do not match");
      return;
    }
    try {
      const payload = {
       uidb64: uid,
        token,
        new_password: password,
         confirm_password: confirm,
      };
      await confirmReset(payload);

      setTimeout(() => router.push("/resetsucess"), 1500);
    } catch (err) {
    
    }
  };

  return (
    <div className=" relative w-full max-w-md overflow-hidden">

      <div className="bg-[#00353D] p-10 rounded-2xl shadow-2xl ring-2 ring-teal-700/30">


        <button onClick={() => router.back()} 
         aria-label="Go back"
        className="absolute left-6 top-12 text-white-400">
          <FaArrowLeft />
        </button>
        <h1 className="text-center text-[#d4af37] text-3xl font-medium mb-8">Reset Your Password</h1>
        <p className="text-center text-teal-100 mb-10">Your new password must be different from your previous password</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="sr-only">New Password</label>
            <div className="relative">
              <input
                type={show1 ? "text" : "password"}
                className="w-full px-4 py-3 rounded-xl text-black bg-white/90 placeholder-gray-600 outline-none"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShow1((s) => !s)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {show1 ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <p className="text-sm text-teal-100 mt-2 ml-2">Must be at least 8 characters</p>
          </div>
          <div>
            <label className="sr-only">Confirm Password</label>
            <div className="relative">
              <input
                type={show2 ? "text" : "password"}
                className="w-full px-4 py-3 rounded-xl text-black bg-white/90 placeholder-gray-600 outline-none"
                placeholder="Confirm New Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShow2((s) => !s)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {show2 ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="mt-10 items-center flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-3/4  rounded-xl py-3 bg-[#d4af37] text-white font-medium disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
        {(localError || error) && (
          <div className="mt-4 text-center text-red-300">{localError || error}</div>
        )}
        {message && <div className="mt-4 text-center text-green-300">{message} Redirecting to login...</div>}
      </div>

      
    </div>
  );
}
