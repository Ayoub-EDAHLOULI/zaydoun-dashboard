"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/lib/routes";

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (isLoading || redirected.current) return;
    redirected.current = true;
    if (isAuthenticated) {
      router.replace(getDashboardPath(user?.role));
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, user, router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--z-bg-base)" }}
    >
      <div
        className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: "var(--z-gold)", borderTopColor: "transparent" }}
      />
    </div>
  );
}
