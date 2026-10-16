"use client";

import { usePathname } from "@/i18n/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usersService } from "@/lib/api/services/users.service";
import type { TierLimits } from "@/types/users.types";

interface LimitsContextType {
  /** null until loaded (or if the request failed) */
  limits: TierLimits | null;
  /** Call after an upload, delete or message so the counts stay current */
  refreshLimits: () => Promise<void>;
}

const LimitsContext = createContext<LimitsContextType | undefined>(undefined);

// Free-tier usage for the signed-in user. Mounted by the app shell.
export function LimitsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [limits, setLimits] = useState<TierLimits | null>(null);

  const refreshLimits = useCallback(async () => {
    try {
      setLimits(await usersService.getLimits());
    } catch {
      // Non-critical: the usage card simply stays hidden
    }
  }, []);

  // Also refetch on navigation, so counts catch up after actions elsewhere
  useEffect(() => {
    usersService
      .getLimits()
      .then(setLimits)
      .catch(() => {});
  }, [pathname]);

  return (
    <LimitsContext.Provider value={{ limits, refreshLimits }}>
      {children}
    </LimitsContext.Provider>
  );
}

export function useLimits() {
  const ctx = useContext(LimitsContext);
  if (!ctx) throw new Error("useLimits must be used inside LimitsProvider");
  return ctx;
}
