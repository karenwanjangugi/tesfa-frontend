"use client";
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/onboarding/login");
    }
  }, [isAuthenticated, loading, router]);
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
