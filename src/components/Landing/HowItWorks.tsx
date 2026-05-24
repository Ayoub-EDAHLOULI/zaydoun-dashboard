// components/Landing/HowItWorks.tsx
"use client";

import { Upload, Cpu, Mic } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Upload,
    title: "Upload to Web",
    description:
      "Drag any PDF into your library. Zaydoun instantly extracts every page, preserving structure, headings, and page numbers — ready in seconds.",
    detail:
      "Supports PDFs up to 500 pages. 5 languages detected automatically.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "Neural Vector Indexing",
    description:
      "Your book is chunked and embedded into a pgvector store. Each passage is mapped semantically so searches return meaning, not just keywords.",
    detail:
      "Powered by OpenAI embeddings + pgvector. Sub-second retrieval at any scale.",
  },
  {
    number: "03",
    icon: Mic,
    title: "Speak Hands-Free",
    description:
      "Open the mobile portal, tap the mic, and ask anything. Whisper transcribes your voice, RAG finds the answer, and TTS reads it back to you.",
    detail: "Works on commutes, workouts, anywhere a screen is inconvenient.",
  },
];

export default function HowItWorks() {
  return (
    <section
      className="py-24 sm:py-32"
      style={{ backgroundColor: "var(--z-bg-base)" }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section header */}
        <div
          className="mb-16 pb-12"
          style={{ borderTop: "1px solid var(--z-border)" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-12">
            <div className="space-y-3">
              <p
                className="text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: "var(--z-gold)" }}
              >
                How it works
              </p>
              <h2
                className="text-3xl sm:text-4xl font-bold"
                style={{ color: "var(--z-text-primary)" }}
              >
                From PDF to conversation
                <br />
                <span style={{ color: "var(--z-text-muted)", fontWeight: 400 }}>
                  in three steps.
                </span>
              </h2>
            </div>
            <p
              className="text-sm max-w-xs leading-relaxed sm:text-right"
              style={{ color: "var(--z-text-muted)" }}
            >
              No setup wizards. No configuration files. Just upload and start
              talking.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop only */}
          <div
            className="hidden lg:block absolute top-11 left-[calc(16.666%+2rem)] right-[calc(16.666%+2rem)] h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--z-border-gold), var(--z-border-gold), transparent)",
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative flex flex-col gap-6 p-6 rounded-2xl transition-all duration-200 group"
                  style={{
                    backgroundColor: "rgba(26,26,26,0.4)",
                    border: "1px solid var(--z-border)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(-4px)";
                    el.style.borderColor = "var(--z-border-gold)";
                    el.style.boxShadow =
                      "0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px var(--z-border-gold)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(0)";
                    el.style.borderColor = "var(--z-border)";
                    el.style.boxShadow = "none";
                  }}
                >
                  {/* Step row: number + icon */}
                  <div className="flex items-center gap-4">
                    {/* Glowing number */}
                    <span
                      className="text-4xl font-black leading-none tabular-nums"
                      style={{
                        color: "var(--z-gold)",
                        textShadow: "0 0 24px rgba(201,168,76,0.4)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {step.number}
                    </span>
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: "var(--z-gold-muted)",
                        border: "1px solid var(--z-border-gold)",
                      }}
                    >
                      <Icon
                        className="w-4.5 h-4.5"
                        style={{ color: "var(--z-gold)" }}
                      />
                    </div>
                    {/* Step index badge for mobile connector feel */}
                    {idx < STEPS.length - 1 && (
                      <div
                        className="lg:hidden ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: "var(--z-bg-overlay)",
                          color: "var(--z-text-muted)",
                          border: "1px solid var(--z-border)",
                        }}
                      >
                        next ↓
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3
                      className="text-base font-semibold"
                      style={{ color: "var(--z-text-primary)" }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--z-text-muted)" }}
                    >
                      {step.description}
                    </p>
                  </div>

                  {/* Detail callout */}
                  <div
                    className="mt-auto rounded-lg px-3 py-2"
                    style={{
                      backgroundColor: "var(--z-bg-overlay)",
                      border: "1px solid var(--z-border)",
                    }}
                  >
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--z-text-secondary)" }}
                    >
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
