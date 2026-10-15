import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

// Entrance for above-the-fold content. Pure CSS (no JS needed), so it starts
// at first paint instead of waiting for hydration. Under reduced motion the
// global rule in tokens.css removes the animation and the content just shows.
export function RiseIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  /** Seconds */
  delay?: number;
  className?: string;
}) {
  const style: CSSProperties = { animationDelay: `${delay}s` };
  return (
    <div className={cn("animate-rise", className)} style={style}>
      {children}
    </div>
  );
}
