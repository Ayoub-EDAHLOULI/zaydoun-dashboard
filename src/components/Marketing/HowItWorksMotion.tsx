"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { DURATION, EASE_OUT } from "@/components/motion";
import { cn } from "@/lib/cn";

// ---------------------------------------------------------------------------
// ScrollTimeline — a vertical rail whose gold fill follows your reading
// position through the steps. Each step's dot lights up as the fill reaches it.
// ---------------------------------------------------------------------------

export function ScrollTimeline({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 55%"],
  });
  // A spring smooths out scroll-wheel steps so the fill glides
  const fill = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  return (
    <div ref={ref} className="relative">
      {/* Rail + fill, aligned with the step numbers (desktop: left column) */}
      <div
        aria-hidden
        className="absolute top-2 bottom-2 start-4.75 w-px bg-border md:start-6.75"
      >
        <motion.div
          className="h-full w-full origin-top bg-gold"
          style={{ scaleY: fill }}
        />
      </div>
      <ol className="flex flex-col gap-20 md:gap-28">{children}</ol>
    </div>
  );
}

export function TimelineStep({
  n,
  title,
  children,
  visual,
}: {
  n: number;
  title: string;
  children: ReactNode;
  visual: ReactNode;
}) {
  const t = useTranslations("howItWorks");
  return (
    <motion.li
      className="relative grid gap-8 ps-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-14 md:ps-20"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
    >
      {/* Step marker on the rail: grey, then a gold ring fades in over it */}
      <span
        aria-hidden
        className="absolute top-0 start-0 flex size-10 items-center justify-center rounded-full border border-border bg-bg-base font-serif text-base text-text-muted md:size-14 md:text-xl"
      >
        <motion.span
          className="absolute -inset-px flex items-center justify-center rounded-full border border-gold bg-bg-base text-gold-light"
          variants={{
            hidden: { opacity: 0, scale: 0.6 },
            show: {
              opacity: 1,
              scale: 1,
              transition: { duration: DURATION.base, ease: EASE_OUT },
            },
          }}
        >
          {String(n).padStart(2, "0")}
        </motion.span>
        {String(n).padStart(2, "0")}
      </span>

      <motion.div
        className="flex flex-col gap-4 pt-1 md:pt-3"
        variants={{
          hidden: { opacity: 0, y: 24 },
          show: {
            opacity: 1,
            y: 0,
            transition: { duration: DURATION.base, ease: EASE_OUT },
          },
        }}
      >
        <h3 className="font-serif text-28 leading-[1.1] font-normal tracking-[-0.01em] md:text-32">
          <span className="sr-only">{t("stepLabel", { n })} </span>
          {title}
        </h3>
        {children}
      </motion.div>

      <motion.div
        aria-hidden
        className="min-w-0"
        variants={{
          hidden: { opacity: 0, y: 32, scale: 0.97 },
          show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              delay: 0.15,
              duration: DURATION.slow,
              ease: EASE_OUT,
            },
          },
        }}
      >
        {visual}
      </motion.div>
    </motion.li>
  );
}

// ---------------------------------------------------------------------------
// AskPipeline — question → passages → answer → page, drawn in sequence
// ---------------------------------------------------------------------------

export interface PipelineNode {
  label: string;
  detail: string;
  icon: ReactNode;
}

const row: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.35 } },
};
const node: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
};
const connector: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.45, ease: EASE_OUT } },
};

export function AskPipeline({ nodes }: { nodes: PipelineNode[] }) {
  return (
    <motion.ol
      className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch lg:gap-3"
      variants={row}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      {nodes.map((n, i) => (
        <PipelineItem
          key={n.label}
          node={n}
          last={i === nodes.length - 1}
          index={i}
        />
      ))}
    </motion.ol>
  );
}

function PipelineItem({
  node: n,
  last,
  index,
}: {
  node: PipelineNode;
  last: boolean;
  index: number;
}) {
  return (
    <>
      <motion.li
        variants={node}
        className={cn(
          "flex flex-col gap-3 rounded-lg border bg-bg-surface p-5",
          last ? "border-border-gold" : "border-border",
        )}
      >
        <span className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-[10px]",
              last
                ? "bg-gold-muted text-gold-light"
                : "bg-bg-elevated text-text-secondary",
            )}
          >
            {n.icon}
          </span>
          <span className="text-xs font-medium tracking-widest text-text-secondary uppercase">
            {String(index + 1).padStart(2, "0")}
          </span>
        </span>
        <span className="text-17 font-semibold">{n.label}</span>
        <span className="text-sm leading-relaxed text-text-secondary">
          {n.detail}
        </span>
      </motion.li>
      {!last && (
        <motion.span
          aria-hidden
          variants={connector}
          className="mx-auto h-6 w-px origin-top self-center bg-border-gold lg:h-px lg:w-8 lg:origin-left rtl:lg:origin-right"
        />
      )}
    </>
  );
}
