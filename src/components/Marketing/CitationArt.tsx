"use client";

import { motion, type Variants } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Bookmark } from "lucide-react";
import { Orb } from "@/components/ui";
import { DURATION, EASE_OUT } from "@/components/motion";

const BEFORE = [92, 100, 86, 95, 60];
const CITED = [100, 94, 98, 72];
const AFTER = [97, 89, 100, 45];

// Sequence when scrolled into view: page rises → cited lines are "highlighted"
// one by one → Zaydoun's card slides in → its page chip pops
const scene: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const page: Variants = {
  hidden: { opacity: 0, y: 30, rotate: -2 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};
const band: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.14,
    },
  },
};
const line: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.5, ease: EASE_OUT } },
};
const card: Variants = {
  hidden: (rtl: boolean) => ({ opacity: 0, x: rtl ? -40 : 40, y: 10 }),
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { delay: 1.2, duration: DURATION.base, ease: EASE_OUT },
  },
};
const chip: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { delay: 1.6, type: "spring", stiffness: 420, damping: 22 },
  },
};

function Line({ width, className }: { width: number; className: string }) {
  return (
    <div
      className={`h-2 rounded-[2px] ${className}`}
      style={{ width: `${width}%` }}
    />
  );
}

export default function CitationArt() {
  const t = useTranslations("home.cite");
  // Arabic mirrors the scene: the page sits right, the card slides from the left
  const rtl = useLocale() === "ar";
  return (
    <motion.div
      aria-hidden
      className="relative h-[520px] min-w-0 flex-[1_1_480px] max-sm:hidden"
      variants={scene}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
    >
      <motion.div
        variants={page}
        className="absolute top-0 start-10 flex h-[470px] w-[340px] flex-col gap-3 rounded-[4px_10px_10px_4px] border border-border-strong bg-bg-elevated px-9 py-10"
      >
        {BEFORE.map((w, i) => (
          <Line key={i} width={w} className="bg-border-strong" />
        ))}
        <motion.div
          variants={band}
          className="-mx-3 my-2.5 flex flex-col gap-3 rounded-[6px] border-s-[3px] border-gold bg-gold-muted p-3"
        >
          {CITED.map((w, i) => (
            <motion.div
              key={i}
              variants={line}
              className="origin-left rtl:origin-right"
              style={{ width: `${w}%` }}
            >
              <div className="h-2 rounded-[2px] bg-gold-dark" />
            </motion.div>
          ))}
        </motion.div>
        {AFTER.map((w, i) => (
          <Line key={i} width={w} className="bg-border-strong" />
        ))}
        <span className="mt-auto self-center font-serif text-sm text-text-secondary italic">
          118
        </span>
      </motion.div>

      <motion.div
        variants={card}
        custom={rtl}
        className="absolute end-0 bottom-0 flex w-[330px] flex-col gap-3 rounded-lg border border-border-strong bg-bg-overlay p-5 shadow-overlay"
      >
        <div className="flex items-center gap-2">
          <Orb size={20} />
          <span className="text-13 font-semibold text-gold-light">Zaydoun</span>
        </div>
        <p className="font-serif text-base leading-normal">
          {t("artAnswer")}
        </p>
        <motion.span
          variants={chip}
          className="inline-flex h-7 items-center gap-1.5 self-start rounded-full bg-gold px-3 text-xs font-semibold text-bg-base"
        >
          <Bookmark size={12} aria-hidden /> {t("artPage", { page: 118 })}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
