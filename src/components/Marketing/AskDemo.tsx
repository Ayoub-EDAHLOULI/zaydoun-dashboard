"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { DURATION, EASE_OUT } from "@/components/motion";
import { Orb, PageTag } from "@/components/ui";
import { cn } from "@/lib/cn";

// Sample exchanges — illustrative copy, not live answers.
// Text lives in messages/<locale>/home.json → ask.<key>
const MODES = [
  { key: "explain", pages: [91] },
  { key: "debate", pages: [104] },
  { key: "find", pages: [279] },
  { key: "connect", pages: [121] },
] as const;

export default function AskDemo() {
  const t = useTranslations("home.ask");
  const tb = useTranslations("home.book");
  const [active, setActive] = useState(1);
  const tabsRef = useRef<HTMLDivElement>(null);
  const mode = MODES[active];

  // Arrow keys move between tabs
  const onKeyDown = (e: KeyboardEvent) => {
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(e.key))
      return;
    e.preventDefault();
    const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
    const next = (active + step + MODES.length) % MODES.length;
    setActive(next);
    tabsRef.current
      ?.querySelectorAll<HTMLButtonElement>("[role=tab]")
      [next]?.focus();
  };

  return (
    <div className="flex flex-wrap items-stretch gap-6">
      <LayoutGroup id="ask-demo">
        <div
          ref={tabsRef}
          role="tablist"
          aria-label={t("tabsLabel")}
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="flex max-w-full flex-[1_1_300px] flex-col gap-2 md:max-w-[380px]"
        >
          {MODES.map((m, i) => {
            const selected = i === active;
            return (
              <button
                key={m.key}
                type="button"
                role="tab"
                id={`ask-tab-${i}`}
                aria-selected={selected}
                aria-controls="ask-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                className={cn(
                  "relative flex items-start gap-4 rounded-md p-5 text-start transition-colors",
                  !selected && "hover:bg-bg-surface/60",
                )}
              >
                {/* The highlight glides between tabs */}
                {selected && (
                  <motion.span
                    layoutId="ask-tab-highlight"
                    aria-hidden
                    className="absolute inset-0 rounded-md border border-border-gold bg-bg-surface"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                <span
                  className={cn(
                    "relative w-[34px] font-serif text-28 leading-none transition-colors",
                    selected ? "text-gold-light" : "text-text-muted",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative flex flex-col gap-1.5">
                  <span className="text-17 font-semibold text-text-primary">
                    {t(`${m.key}.name`)}
                  </span>
                  <span className="text-sm leading-normal text-text-secondary">
                    {t(`${m.key}.hint`)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <div
        id="ask-panel"
        role="tabpanel"
        aria-labelledby={`ask-tab-${active}`}
        className="flex min-w-0 flex-[2_1_560px] flex-col gap-5.5 rounded-lg border border-border bg-bg-surface p-6 md:p-9"
      >
        <div className="flex items-center gap-3 border-b border-border pb-4.5">
          <span
            aria-hidden
            className="h-[34px] w-[26px] rounded-[5px] rounded-s-[2px] border-s-[3px] border-gold-dark bg-bg-overlay"
          />
          <span className="flex flex-col gap-0.5">
            <span className="font-serif text-base leading-tight font-medium">
              {tb("title")}
            </span>
            <span className="text-xs text-text-secondary">
              {t("replies", { author: tb("author") })}
            </span>
          </span>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            className="flex flex-col gap-5.5"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.18 } },
              exit: { opacity: 0, transition: { duration: DURATION.fast } },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10, scale: 0.98 },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.4, ease: EASE_OUT },
                },
              }}
              className="max-w-[80%] origin-bottom-right self-end rounded-[16px] rounded-ee-[4px] bg-bg-elevated px-4 py-3 text-15 leading-[1.55] rtl:origin-bottom-left"
            >
              {t(`${mode.key}.q`)}
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: DURATION.base, ease: EASE_OUT },
                },
              }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-2.5">
                <Orb size={24} />
                <span className="text-13 font-semibold text-gold-light">
                  Zaydoun
                </span>
              </div>
              <p className="font-serif text-20 leading-[1.65]">
                {t(`${mode.key}.a`)}
              </p>
              <div className="flex flex-wrap gap-2">
                {mode.pages.map((p) => (
                  <PageTag key={p} page={p} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
