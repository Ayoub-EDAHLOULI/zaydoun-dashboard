"use client";

import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}

// Period switcher and filters. The selected item lifts to bg-overlay; no gold.
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);

  // Arrow keys move the selection (roving tabindex)
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const i = options.findIndex((o) => o.value === value);
    const step = e.key === "ArrowRight" ? 1 : -1;
    const next = options[(i + step + options.length) % options.length];
    onChange(next.value);
    listRef.current
      ?.querySelector<HTMLButtonElement>(`[data-value="${next.value}"]`)
      ?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn(
        "inline-flex w-fit max-w-full gap-0.5 overflow-x-auto rounded-[10px] border border-border bg-bg-surface p-1",
        className,
      )}
    >
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            data-value={o.value}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(o.value)}
            className={cn(
              "h-9 rounded-[7px] px-3.5 text-sm whitespace-nowrap transition-colors",
              selected
                ? "bg-bg-overlay font-medium text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                : "text-text-secondary hover:text-text-primary",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
