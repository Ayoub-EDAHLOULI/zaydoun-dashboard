"use client";

import { motion } from "framer-motion";
import { EASE_OUT } from "@/components/motion";
import { cn } from "@/lib/cn";

// A hairline that draws itself from left to right when scrolled into view
export default function ScaleLine({ className }: { className?: string }) {
  return (
    <motion.div
      aria-hidden
      className={cn("h-px origin-left", className)}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1, ease: EASE_OUT }}
    />
  );
}
