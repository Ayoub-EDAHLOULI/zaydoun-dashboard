"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { BookOpen } from "lucide-react";
import { Orb, PageTag, ThinkingIndicator } from "@/components/ui";
import { DURATION, EASE_OUT } from "@/components/motion";

type Phase = "idle" | "asked" | "thinking" | "answered";

// When each step of the sample exchange appears (ms after mount)
const TIMELINE: Array<[Phase, number]> = [
  ["asked", 700],
  ["thinking", 1300],
  ["answered", 2700],
];

const ORDER: Phase[] = ["idle", "asked", "thinking", "answered"];
const reached = (phase: Phase, step: Phase) =>
  ORDER.indexOf(phase) >= ORDER.indexOf(step);

export default function HeroVisual() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  // Play the exchange once (skipped entirely under reduced motion)
  useEffect(() => {
    if (reduce) return;
    const timers = TIMELINE.map(([p, ms]) => setTimeout(() => setPhase(p), ms));
    return () => timers.forEach(clearTimeout);
  }, [reduce]);
  const shown: Phase = reduce ? "answered" : phase;

  // The orb drifts up slower than the page as you scroll past the hero
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const orbY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const orbOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

  return (
    <div
      ref={ref}
      className="flex min-w-0 flex-[1_1_460px] flex-col items-center"
    >
      {/* Three layers so their transforms don't fight:
          scroll parallax → entrance → idle float */}
      <motion.div
        className="mt-8 mb-14 hidden sm:block"
        style={{ y: orbY, opacity: orbOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: DURATION.slow, ease: EASE_OUT }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          >
            <Orb size={220} rings={2} halo>
              <BookOpen
                size={64}
                strokeWidth={1.2}
                className="text-text-primary/90"
              />
            </Orb>
          </motion.div>
        </motion.div>
      </motion.div>

      <figure
        aria-label="Sample conversation"
        className="flex min-h-[300px] w-full max-w-[460px] flex-col gap-3.5"
      >
        <AnimatePresence>
          {reached(shown, "asked") && (
            <motion.div
              key="q"
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: DURATION.base, ease: EASE_OUT }}
              className="max-w-[78%] origin-bottom-right self-end rounded-[16px_16px_4px_16px] border border-border bg-bg-elevated px-4 py-3 text-15 leading-[1.55]"
            >
              Is ʿasabiyya just a fancy word for tribalism?
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {shown === "thinking" && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION.fast }}
              className="px-1 pt-2"
            >
              <ThinkingIndicator />
            </motion.div>
          )}
          {shown === "answered" && (
            <motion.div
              key="answer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.base, ease: EASE_OUT }}
              className="flex flex-col gap-3 rounded-lg border border-border bg-bg-surface px-5.5 py-5 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.8)]"
            >
              <div className="flex items-center gap-2.5">
                <Orb size={22} />
                <span className="text-13 font-semibold text-gold-light">
                  Zaydoun
                </span>
                <span className="ml-auto text-xs text-text-secondary">
                  Al-Muqaddimah
                </span>
              </div>
              <p className="font-serif text-lg leading-relaxed">
                Not quite, and that&apos;s the trap most summaries fall into.
                Kinship is where it starts, but shared hardship can build it
                too. Think social glue, not “my tribe first”.
              </p>
              <motion.span
                className="self-start"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.35,
                  duration: DURATION.base,
                  ease: EASE_OUT,
                }}
              >
                <PageTag page={118} />
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </figure>
    </div>
  );
}
