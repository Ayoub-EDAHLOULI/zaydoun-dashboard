"use client";

import { createContext, useCallback, useContext, ReactNode } from "react";
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import { useLocale } from "next-intl";
import { isRtl } from "@/i18n/routing";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { useMediaQuery, MOBILE_QUERY } from "@/hooks/useMediaQuery";

type ToastType = "info" | "success" | "warning" | "error";

interface ToastContextType {
  notify: (message: string, type?: ToastType, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ICONS = {
  success: <CircleCheck size={20} className="text-success" aria-hidden />,
  error: <CircleAlert size={20} className="text-error" aria-hidden />,
  warning: <TriangleAlert size={20} className="text-warning" aria-hidden />,
  info: <Info size={20} className="text-info-text" aria-hidden />,
} as const;

export default function ToastProvider({ children }: { children: ReactNode }) {
  // Bottom-right on desktop, top on mobile (see design/README.md)
  const isMobile = useMediaQuery(MOBILE_QUERY);

  // Stable so pages can safely list `notify` in effect dependencies
  const notify = useCallback(
    (message: string, type: ToastType = "info", options?: ToastOptions) => {
      toast[type](message, { icon: ICONS[type], ...options });
    },
    [],
  );

  const rtl = isRtl(useLocale());

  return (
    <ToastContext.Provider value={{ notify }}>
      <ToastContainer
        // Bottom end corner: the left in Arabic
        position={isMobile ? "top-center" : rtl ? "bottom-left" : "bottom-right"}
        rtl={rtl}
        autoClose={5000}
        hideProgressBar
        closeButton={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
};
