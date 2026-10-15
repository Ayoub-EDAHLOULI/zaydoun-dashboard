"use client";

import type { ReactNode } from "react";
import { MotionConfig, motion, type Variants } from "framer-motion";

// ---------------------------------------------------------------------------
// Motion tokens — one curve, three speeds, used everywhere
// ---------------------------------------------------------------------------

/** Quick start, long soft landing ("ease-out-quint"-like) */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.2, // hovers, small state changes
  base: 0.55, // reveals
  slow: 0.9, // hero, large surfaces
} as const;

/** How far content travels as it reveals (px) */
export const RISE = 24;

/** Gap between staggered children (s) */
export const STAGGER = 0.08;

// Reveals start a little before the element is fully in view
const VIEWPORT = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -8% 0px",
} as const;

// ---------------------------------------------------------------------------
// MotionProvider — honour the OS "reduce motion" setting: movement is
// dropped, opacity fades stay (they don't trigger vestibular issues)
// ---------------------------------------------------------------------------

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

// ---------------------------------------------------------------------------
// Reveal — fade + rise when the element scrolls into view (once)
// ---------------------------------------------------------------------------

const TAGS = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
  span: motion.span,
  p: motion.p,
  figure: motion.figure,
  article: motion.article,
} as const;

type Tag = keyof typeof TAGS;

interface RevealProps {
  children: ReactNode;
  as?: Tag;
  className?: string;
  /** Seconds to wait after entering the viewport */
  delay?: number;
  /** Distance to rise from, px. 0 = fade only */
  y?: number;
  /** Slide in from the side instead (px; negative = from the left) */
  x?: number;
  /** Start slightly smaller (e.g. 0.96) */
  scale?: number;
  duration?: number;
  id?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
}

export function Reveal({
  children,
  as = "div",
  className,
  delay = 0,
  y = RISE,
  x = 0,
  scale = 1,
  duration = DURATION.base,
  ...rest
}: RevealProps) {
  const Component = TAGS[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE_OUT }}
      {...rest}
    >
      {children}
    </Component>
  );
}

// ---------------------------------------------------------------------------
// Stagger / StaggerItem — children reveal one after another
// ---------------------------------------------------------------------------

const container = (gap: number, delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

const item = (y: number, scale: number): Variants => ({
  hidden: { opacity: 0, y, scale },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
});

export function Stagger({
  children,
  as = "div",
  className,
  gap = STAGGER,
  delay = 0,
  /** Animate on mount instead of on scroll (above-the-fold content) */
  immediate = false,
  ...rest
}: {
  children: ReactNode;
  as?: Tag | "ul" | "ol";
  className?: string;
  gap?: number;
  delay?: number;
  immediate?: boolean;
  "aria-label"?: string;
  role?: string;
}) {
  const Component =
    as === "ul" ? motion.ul : as === "ol" ? motion.ol : TAGS[as];
  return (
    <Component
      className={className}
      variants={container(gap, delay)}
      initial="hidden"
      {...(immediate
        ? { animate: "show" }
        : { whileInView: "show", viewport: VIEWPORT })}
      {...rest}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({
  children,
  as = "div",
  className,
  y = RISE,
  scale = 1,
  ...rest
}: {
  children: ReactNode;
  as?: Tag;
  className?: string;
  y?: number;
  scale?: number;
  "aria-labelledby"?: string;
  "aria-hidden"?: boolean;
}) {
  const Component = TAGS[as];
  return (
    <Component className={className} variants={item(y, scale)} {...rest}>
      {children}
    </Component>
  );
}
