"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import { useAuth } from "@/contexts/AuthContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoading, isAuthenticated, user } = useAuth();
  const router = useRouter();

  const isActive = user?.isActive !== false;

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) router.replace("/login");
    else if (!isActive) router.replace("/login?deactivated=1");
  }, [isLoading, isAuthenticated, isActive, router]);

  if (isLoading) {
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

  if (!isAuthenticated || !isActive) return null;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "var(--z-bg-base)" }}
    >
      <AppSidebar isOpen={isSidebarOpen} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AppHeader
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
        />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
