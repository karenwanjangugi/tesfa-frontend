"use client";
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function ProtectedRoute({
  children,
  allowedRoles = ["user", "admin"],
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { isAuthenticated, userRole, loading } = useAuth();
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
  if (
    userRole &&
    !allowedRoles.includes(userRole)
  ) {
    router.push("/dashboard");
    return null;
  }
  return <>{children}</>;
}
