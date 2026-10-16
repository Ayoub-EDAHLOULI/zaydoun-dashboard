"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowUp } from "lucide-react";
import { EASE_OUT } from "@/components/motion";

const SHOW_AFTER = 640; // px scrolled before the button appears

// Floating "back to top" with a ring that fills as you read down the page
export default function ScrollToTop() {
  const t = useTranslations("marketing");
  const reduce = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > SHOW_AFTER));

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    // Return keyboard focus to the start of the page
    const target = document.getElementById("top");
    target?.focus({ preventScroll: true });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label={t("backToTop")}
          title={t("backToTop")}
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.94 }}
          className="group fixed end-5 bottom-20 z-40 flex size-12 items-center justify-center rounded-full border border-border-strong bg-bg-overlay text-text-primary shadow-overlay transition-colors hover:text-gold-light md:end-8 md:bottom-8"
        >
          <svg
            aria-hidden
            viewBox="0 0 48 48"
            className="absolute inset-0 size-full -rotate-90"
          >
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="var(--color-gold)"
              strokeWidth="2"
              strokeLinecap="round"
              // pathLength is 0→1 of the circle; Framer manages the dash pattern
              style={{ pathLength: progress }}
            />
          </svg>
          <ArrowUp size={20} aria-hidden className="relative" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
