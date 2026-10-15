"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
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
  const [phase, setPhase] = useState<Phase>("idle");

  // Play the exchange once (skipped entirely under reduced motion)
  useEffect(() => {
    if (reduce) return;
    const timers = TIMELINE.map(([p, ms]) => setTimeout(() => setPhase(p), ms));
    return () => timers.forEach(clearTimeout);
  }, [reduce]);
  const shown: Phase = reduce ? "answered" : phase;

  return (
    // Above the hero orb's layer, so its rings pass behind the card
    <div className="relative z-10 flex min-w-0 flex-[1_1_460px] flex-col items-center justify-center">
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

// ---------------------------------------------------------------------------
// HeroOrb — glows behind the hero headline.
//   • light bands turn slowly across the surface (a lit globe rotating)
//   • a glint sweeps across it every few seconds
//   • thin rings pulse outward and fade, one after another
//   • a soft glow breathes behind it
// Loops are CSS (transform/opacity only; still under reduced motion). The body
// is dimmed so the headline on top keeps AA contrast.
// ---------------------------------------------------------------------------

const ORB = 380;
const RIPPLES = [0, 3, 6]; // s delays — one ring every 3s, each lives 9s

export function HeroOrb() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, -70]);
  const fade = useTransform(scrollY, [0, 600], [1, 0.5]);

  const centred = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  } as const;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none"
      style={{ y, opacity: fade }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: DURATION.slow, ease: EASE_OUT }}
      >
        <motion.div
          className="relative"
          style={{ width: ORB, height: ORB }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
        >
          {/* Breathing glow */}
          <span
            style={{
              ...centred,
              width: ORB * 1.9,
              height: ORB * 1.9,
              borderRadius: 9999,
              background:
                "radial-gradient(circle, rgba(201,168,76,0.16) 0%, rgba(201,168,76,0.05) 40%, transparent 68%)",
              animation: "sun-pulse 8s ease-in-out infinite",
            }}
          />

          {/* Rings flowing out of the orb */}
          {RIPPLES.map((delay) => (
            <span
              key={delay}
              style={{
                ...centred,
                width: ORB,
                height: ORB,
                borderRadius: 9999,
                border: "1px solid rgba(224,194,114,0.32)",
                animation: `orb-ripple 9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s infinite`,
                opacity: 0,
              }}
            />
          ))}

          {/* The orb — dimmed so text on top stays readable */}
          <div className="absolute inset-0 opacity-45">
            <Orb size={ORB} />
            <div className="absolute inset-0 overflow-hidden rounded-full">
              {/* Soft glows orbiting the surface (a lit globe turning).
                  Round radial gradients — no wedge edges, so no seams */}
              <span
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 26% 34%, rgba(255,246,214,0.32) 0%, rgba(255,246,214,0.1) 18%, transparent 36%), radial-gradient(circle at 72% 70%, rgba(255,246,214,0.18) 0%, rgba(255,246,214,0.05) 16%, transparent 32%)",
                  animation: "sun-orbit 40s linear infinite",
                }}
              />
              {/* Fixed highlight for volume */}
              <span
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 32% 26%, rgba(255,250,232,0.45) 0%, rgba(255,250,232,0.1) 22%, transparent 42%)",
                }}
              />
              {/* Glint sweeping across */}
              <span
                className="absolute inset-y-[-20%] left-0 w-1/3"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,252,240,0.4), transparent)",
                  animation:
                    "orb-glint 7s cubic-bezier(0.45, 0, 0.25, 1) 1.5s infinite",
                  transform: "translateX(-140%) rotate(25deg)",
                }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
