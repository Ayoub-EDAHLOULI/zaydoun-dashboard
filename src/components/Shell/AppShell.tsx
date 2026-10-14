"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu } from "lucide-react";
import { Avatar, Badge, Orb } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { LimitsProvider } from "@/contexts/LimitsContext";
import { cn } from "@/lib/cn";
import { pageTitle, usesRail, type ShellArea } from "./navigation";
import { RailContent, SidebarContent } from "./SidebarContent";

// ---------------------------------------------------------------------------
// Mobile drawer (below 768px)
// ---------------------------------------------------------------------------

function Drawer({
  open,
  onClose,
  area,
  returnFocusTo,
}: {
  open: boolean;
  onClose: () => void;
  area: ShellArea;
  returnFocusTo: React.RefObject<HTMLButtonElement | null>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Lock scroll, focus the first link, close on Escape, restore focus
  useEffect(() => {
    if (!open) return;
    const trigger = returnFocusTo.current;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() =>
      panelRef.current?.querySelector<HTMLElement>("nav a")?.focus(),
    );
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open, onClose, returnFocusTo]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <motion.div
            className="absolute inset-0 bg-bg-base/70 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="absolute inset-y-0 left-0 w-[288px] max-w-[85vw] border-r border-border bg-bg-surface shadow-overlay"
            initial={reduceMotion ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={reduceMotion ? undefined : { x: "-100%" }}
            transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <SidebarContent area={area} onNavigate={onClose} onClose={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// AppShell — used by /app (reader) and /dashboard (admin)
// ---------------------------------------------------------------------------

export default function AppShell({
  area,
  children,
}: {
  area: ShellArea;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, isAuthenticated, isAdmin, user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  // Stable, so the drawer's focus/scroll effect doesn't re-run on every render
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const isActive = user?.isActive !== false;
  const allowed =
    isAuthenticated && isActive && (area === "reader" || isAdmin);
  const rail = usesRail(pathname);

  // Same guards as before: signed-out → login, deactivated → notice,
  // non-admins can't open /dashboard
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) router.replace("/login");
    else if (!isActive) router.replace("/login?deactivated=1");
    else if (area === "admin" && !isAdmin) router.replace("/login");
  }, [isLoading, isAuthenticated, isActive, isAdmin, area, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-base">
        <Orb size={56} breathing />
        <span className="sr-only" role="status">
          Loading
        </span>
      </div>
    );
  }

  if (!allowed) return null;

  return (
    <LimitsProvider>
      <div className="flex h-screen overflow-hidden bg-bg-base">
        {/* Desktop sidebar / rail */}
        <aside
          aria-label={area === "admin" ? "Admin" : "App"}
          className={cn(
            "hidden shrink-0 border-r border-border bg-bg-surface md:block",
            rail ? "w-[72px]" : "w-64",
          )}
        >
          {rail ? <RailContent area={area} /> : <SidebarContent area={area} />}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile top bar — the chat screen brings its own header instead */}
          <header
            className={cn(
              "h-[60px] shrink-0 items-center gap-1 border-b border-border-subtle px-2",
              rail ? "hidden" : "flex md:hidden",
            )}
          >
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
              aria-expanded={drawerOpen}
              className="flex size-11 items-center justify-center rounded-sm text-text-primary transition-colors hover:bg-bg-elevated"
            >
              <Menu size={22} aria-hidden />
            </button>
            <span className="truncate text-[17px] font-semibold">
              {pageTitle(pathname)}
            </span>
            {area === "admin" && (
              <Badge tone="gold" className="ml-2 h-[22px] px-[7px] text-[11px]">
                ADMIN
              </Badge>
            )}
            <Avatar
              name={user?.name}
              email={user?.email}
              highlight
              className="mr-1 ml-auto"
            />
          </header>

          <main
            id="main"
            className={cn(
              "flex-1 overflow-y-auto",
              // The chat screen manages its own full-height layout
              !rail && "px-4 pt-5 pb-12 md:px-12 md:pt-10 md:pb-16",
            )}
          >
            {children}
          </main>
        </div>

        <Drawer
          open={drawerOpen}
          onClose={closeDrawer}
          area={area}
          returnFocusTo={menuButtonRef}
        />
      </div>
    </LimitsProvider>
  );
}
