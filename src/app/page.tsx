"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/lib/routes";
import LandingNav from "@/components/Landing/LandingNav";
import Hero from "@/components/Landing/Hero";
import Features from "@/components/Landing/Features";
import LandingFooter from "@/components/Landing/LandingFooter";

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (isLoading || redirected.current) return;
    if (isAuthenticated) {
      redirected.current = true;
      router.replace(getDashboardPath(user?.role));
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show landing page for unauthenticated visitors.
  // Authenticated users are redirected above — show nothing while that resolves.
  if (isLoading || isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--z-bg-base)" }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{
            borderColor: "var(--z-gold)",
            borderTopColor: "transparent",
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--z-bg-base)", minHeight: "100vh" }}>
      <LandingNav />
      <Hero />
      <Features />
      <LandingFooter />
    </div>
  );
}
