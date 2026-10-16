"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { DURATION, EASE_OUT } from "@/components/motion";
import { cn } from "@/lib/cn";

// Accordion with animated height. One answer open at a time.
export default function FaqList({
  items,
  defaultOpen = 0,
}: {
  items: { q: string; a: string }[];
  /** Index open on first render; null = all closed */
  defaultOpen?: number | null;
}) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className="border-t border-border">
      {items.map((f, i) => {
        const expanded = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-q-${i}`;
        return (
          <div key={f.q} className="border-b border-border">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : i)}
                className="flex min-h-16 w-full items-center justify-between gap-4 py-4 text-start text-17 font-medium transition-colors hover:text-gold-light"
              >
                {f.q}
                <ChevronDown
                  size={20}
                  aria-hidden
                  className={cn(
                    "shrink-0 text-text-secondary transition-transform duration-300",
                    expanded && "rotate-180",
                  )}
                />
              </button>
            </h3>
            {/* Always in the DOM (readable by search engines); collapsed
                answers are inert so keyboard and screen readers skip them */}
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!expanded}
              initial={false}
              animate={{
                height: expanded ? "auto" : 0,
                opacity: expanded ? 1 : 0,
              }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="overflow-hidden"
            >
              <motion.p
                initial={false}
                animate={{ y: expanded ? 0 : -6 }}
                transition={{ duration: DURATION.base, ease: EASE_OUT }}
                className="pb-6 text-15 leading-relaxed text-text-secondary"
              >
                {f.a}
              </motion.p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
