import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface OrbProps {
  /** Diameter in px. Design sizes: 22–24 (avatar), 56, 72, 140, 220 */
  size?: number;
  /** Breathe only while Zaydoun is thinking or listening */
  breathing?: boolean;
  /** Number of thin gold rings around the orb (0–2) */
  rings?: 0 | 1 | 2;
  /** Soft glow behind the orb (large sizes) */
  halo?: boolean;
  /** Dim the orb (e.g. empty states) */
  muted?: boolean;
  /** Optional centred icon */
  children?: ReactNode;
  className?: string;
}

// The only glowing object in the UI. Purely decorative.
export function Orb({
  size = 56,
  breathing = false,
  rings = 0,
  halo = false,
  muted = false,
  children,
  className,
}: OrbProps) {
  const small = size <= 32;

  const glow = small
    ? breathing
      ? "0 0 0 6px rgba(201,168,76,0.12), 0 0 20px rgba(201,168,76,0.5)"
      : "0 0 12px rgba(201,168,76,0.4)"
    : `0 0 ${Math.round(size * 0.5)}px rgba(201,168,76,${muted ? 0.35 : 0.45})`;

  return (
    <span
      aria-hidden
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
    >
      {halo && (
        <span
          className="absolute rounded-full"
          style={{
            inset: -size * 0.6,
            background:
              "radial-gradient(circle, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0.05) 45%, transparent 70%)",
          }}
        />
      )}
      {Array.from({ length: rings }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full border"
          style={{
            inset: -(size * 0.2 + i * size * 0.18),
            borderColor: `rgba(201,168,76,${0.2 - i * 0.08})`,
          }}
        />
      ))}
      <span
        className={cn(
          "relative flex size-full items-center justify-center rounded-full text-[#1a1408]",
          breathing && "animate-orb-breathe",
        )}
        style={{
          background: small
            ? "var(--orb-gradient-small)"
            : "var(--orb-gradient)",
          boxShadow: glow,
          opacity: muted ? 0.85 : 1,
        }}
      >
        {children}
      </span>
    </span>
  );
}
