"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Orb, PageTag } from "@/components/ui";
import { cn } from "@/lib/cn";

// Sample exchanges — illustrative copy, not live answers
const MODES = [
  {
    name: "Explain",
    hint: "A hard passage, made clear.",
    q: "Explain the opening of chapter 2 like I'm new to this.",
    a: "Sure. He starts with one simple claim: how people live shapes who they become. Desert life makes people tough and close-knit, city life makes them comfortable. Everything after builds on that contrast.",
    pages: [91],
  },
  {
    name: "Debate",
    hint: "Push back. He pushes back too.",
    q: "Honestly, I think he's just romanticising the desert.",
    a: "Fair hit, and you're not the first to make it. But notice he never says desert life is better. He says it breeds stronger solidarity, and that cities trade it for comfort. Want me to argue his side harder?",
    pages: [104],
  },
  {
    name: "Find",
    hint: "Where exactly did he say that?",
    q: "Where does he talk about taxes rising at the end of a dynasty?",
    a: "He lays it out as a pattern first, then comes back to what it does to trade. Start with the first passage, it's shorter than you think.",
    pages: [279],
  },
  {
    name: "Connect",
    hint: "Link ideas across chapters.",
    q: "How does that tie back to ʿasabiyya?",
    a: "Directly. Rising taxes are a symptom. The rulers have lost the group feeling that once bought them loyalty for free, so now they pay for it in money.",
    pages: [121],
  },
];

export default function AskDemo() {
  const [active, setActive] = useState(1);
  const tabsRef = useRef<HTMLDivElement>(null);
  const mode = MODES[active];

  // Arrow keys move between tabs
  const onKeyDown = (e: KeyboardEvent) => {
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(e.key)) return;
    e.preventDefault();
    const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
    const next = (active + step + MODES.length) % MODES.length;
    setActive(next);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[next]?.focus();
  };

  return (
    <div className="flex flex-wrap items-stretch gap-6">
      <div
        ref={tabsRef}
        role="tablist"
        aria-label="Ways to ask"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="flex max-w-full flex-[1_1_300px] flex-col gap-2 md:max-w-[380px]"
      >
        {MODES.map((m, i) => {
          const selected = i === active;
          return (
            <button
              key={m.name}
              type="button"
              role="tab"
              id={`ask-tab-${i}`}
              aria-selected={selected}
              aria-controls="ask-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                "flex items-start gap-4 rounded-md border p-5 text-left transition-colors",
                selected
                  ? "border-border-gold bg-bg-surface"
                  : "border-transparent hover:bg-bg-surface/60",
              )}
            >
              <span
                className={cn(
                  "w-[34px] font-serif text-28 leading-none",
                  selected ? "text-gold-light" : "text-text-muted",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex flex-col gap-1.5">
                <span className="text-17 font-semibold text-text-primary">{m.name}</span>
                <span className="text-sm leading-normal text-text-secondary">{m.hint}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        id="ask-panel"
        role="tabpanel"
        aria-labelledby={`ask-tab-${active}`}
        className="flex min-w-0 flex-[2_1_560px] flex-col gap-5.5 rounded-lg border border-border bg-bg-surface p-6 md:p-9"
      >
        <div className="flex items-center gap-3 border-b border-border pb-4.5">
          <span aria-hidden className="h-[34px] w-[26px] rounded-[2px_5px_5px_2px] border-l-[3px] border-gold-dark bg-bg-overlay" />
          <span className="flex flex-col gap-0.5">
            <span className="font-serif text-base leading-tight font-medium">Al-Muqaddimah</span>
            <span className="text-xs text-text-secondary">Ibn Khaldun · replies in English</span>
          </span>
        </div>
        <div className="max-w-[80%] self-end rounded-[16px_16px_4px_16px] bg-bg-elevated px-4 py-3 text-15 leading-[1.55]">
          {mode.q}
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <Orb size={24} />
            <span className="text-13 font-semibold text-gold-light">Zaydoun</span>
          </div>
          <p className="font-serif text-20 leading-[1.65]">{mode.a}</p>
          <div className="flex flex-wrap gap-2">
            {mode.pages.map((p) => (
              <PageTag key={p} page={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
