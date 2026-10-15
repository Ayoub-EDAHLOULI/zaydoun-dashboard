"use client";

import type { CSSProperties } from "react";
import { MotionConfig, motion } from "framer-motion";
import { Orb } from "@/components/ui";
import { EASE_OUT } from "@/components/motion";

// Where the sun sits inside the panel (its centre)
const CENTER = { left: "calc(100% - 120px)", top: "400px" } as const;
const SIZE = 200;

// Light shafts falling from the sun towards the lower left (deg, width px, s, delay s)
const BEAMS = [
  { angle: 32, width: 150, duration: 9, delay: 0 },
  { angle: 48, width: 90, duration: 12, delay: 2.5 },
  { angle: 62, width: 180, duration: 14, delay: 5 },
  { angle: 78, width: 70, duration: 10, delay: 7 },
];

// Dust drifting up through the light (% of panel, px size, s, delay s, drift px)
const MOTES = [
  { x: 52, y: 62, s: 3, d: 11, delay: 0, dx: -24 },
  { x: 60, y: 70, s: 2, d: 13, delay: 1.5, dx: -12 },
  { x: 45, y: 55, s: 2, d: 9, delay: 3, dx: -30 },
  { x: 68, y: 58, s: 3, d: 15, delay: 0.8, dx: -18 },
  { x: 38, y: 68, s: 2, d: 12, delay: 4.2, dx: -22 },
  { x: 57, y: 78, s: 2, d: 14, delay: 2.2, dx: -8 },
  { x: 74, y: 66, s: 2, d: 10, delay: 5.5, dx: -26 },
  { x: 48, y: 74, s: 3, d: 16, delay: 6.4, dx: -14 },
  { x: 64, y: 50, s: 2, d: 11, delay: 3.8, dx: -20 },
  { x: 33, y: 60, s: 2, d: 13, delay: 7.2, dx: -16 },
  { x: 70, y: 76, s: 2, d: 12, delay: 8.1, dx: -28 },
  { x: 55, y: 46, s: 2, d: 14, delay: 9, dx: -10 },
];

const centred: CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  transform: "translate(-50%, -50%)",
};

// Soft rays: thin repeating wedges, faded out towards the edge
const rays = (alpha: number, ray: number, gap: number): CSSProperties => {
  const fade = "radial-gradient(circle, #000 18%, transparent 68%)";
  return {
    background: `repeating-conic-gradient(from 0deg, rgba(224,194,114,${alpha}) 0deg ${ray}deg, transparent ${ray}deg ${ray + gap}deg)`,
    maskImage: fade,
    WebkitMaskImage: fade,
    borderRadius: "9999px",
  };
};

export default function SunScene() {
  return (
    <MotionConfig reducedMotion="user">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Sunbeams — under everything else, fading in and out on their own clocks */}
        {BEAMS.map((b, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              ...CENTER,
              width: b.width,
              height: 1100,
              transformOrigin: "top center",
              transform: `translateX(-50%) rotate(${b.angle}deg)`,
              background:
                "linear-gradient(to bottom, rgba(224,194,114,0.14), rgba(224,194,114,0.05) 40%, transparent 80%)",
              animation: `sun-beam ${b.duration}s ease-in-out ${b.delay}s infinite`,
              opacity: 0,
            }}
          />
        ))}

        {/* Dust in the light */}
        {MOTES.map((m, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-gold-light"
            style={
              {
                left: `${m.x}%`,
                top: `${m.y}%`,
                width: m.s,
                height: m.s,
                boxShadow: "0 0 6px rgba(224,194,114,0.8)",
                animation: `sun-mote ${m.d}s linear ${m.delay}s infinite`,
                opacity: 0,
                "--mote-dx": `${m.dx}px`,
              } as CSSProperties
            }
          />
        ))}

        {/* The sun rises into place, then everything around it loops */}
        <motion.div
          className="absolute"
          style={CENTER}
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: EASE_OUT }}
        >
          {/* Corona */}
          <span
            style={{
              ...centred,
              width: 620,
              height: 620,
              borderRadius: 9999,
              background:
                "radial-gradient(circle, rgba(201,168,76,0.26) 0%, rgba(201,168,76,0.08) 38%, transparent 68%)",
              animation: "sun-pulse 7s ease-in-out infinite",
            }}
          />
          {/* Two ray layers turning in opposite directions */}
          <span
            style={{
              ...centred,
              width: 760,
              height: 760,
              ...rays(0.09, 2.5, 12.5),
              animation: "sun-spin 90s linear infinite",
            }}
          />
          <span
            style={{
              ...centred,
              width: 600,
              height: 600,
              ...rays(0.07, 1.5, 7.5),
              animation: "sun-spin-reverse 140s linear infinite",
            }}
          />
          {/* Ripples of light */}
          {[0, 3].map((delay) => (
            <span
              key={delay}
              style={{
                ...centred,
                width: SIZE + 40,
                height: SIZE + 40,
                borderRadius: 9999,
                border: "1px solid rgba(224,194,114,0.35)",
                animation: `sun-ripple 6s ease-out ${delay}s infinite`,
                opacity: 0,
              }}
            />
          ))}
          {/* The sun itself, with a highlight slowly circling its face */}
          <span style={{ ...centred, width: SIZE, height: SIZE }}>
            <Orb size={SIZE} />
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <span
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 30% 26%, rgba(255,248,222,0.55) 0%, rgba(255,248,222,0.12) 26%, transparent 46%)",
                  animation: "sun-orbit 26s linear infinite",
                }}
              />
            </span>
          </span>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
