"use client";

import Link from "next/link";
import { ArrowRight, Mic, BookOpen, Zap } from "lucide-react";

function ProductPreview() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "var(--z-bg-surface)",
        border: "1px solid var(--z-border)",
        boxShadow:
          "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.08)",
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          borderBottom: "1px solid var(--z-border)",
          backgroundColor: "var(--z-bg-elevated)",
        }}
      >
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: "#e05c5c" }}
        />
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: "#e6a817" }}
        />
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: "#4caf7d" }}
        />
        <span
          className="ml-3 text-xs font-medium"
          style={{ color: "var(--z-text-muted)" }}
        >
          zaydoun.ai — My Library
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Book card */}
        <div
          className="rounded-xl p-4 flex gap-4 items-start transition-all duration-200"
          style={{
            backgroundColor: "var(--z-bg-elevated)",
            border: "1px solid var(--z-border-gold)",
          }}
        >
          {/* Book cover placeholder */}
          <div
            className="w-12 h-16 rounded-lg shrink-0 flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--z-gold-dark), var(--z-gold))",
            }}
          >
            <BookOpen className="w-5 h-5" style={{ color: "#0d0d0d" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--z-text-primary)" }}
            >
              Sapiens: A Brief History
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--z-text-muted)" }}
            >
              Yuval Noah Harari · 443 pages
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className="text-xs px-2 py-0.5 rounded-md font-semibold"
                style={{
                  backgroundColor: "rgba(76,175,125,0.15)",
                  color: "#4caf7d",
                }}
              >
                Ready
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-md uppercase"
                style={{
                  backgroundColor: "var(--z-bg-overlay)",
                  color: "var(--z-text-muted)",
                }}
              >
                EN
              </span>
            </div>
          </div>
        </div>

        {/* Conversation bubble */}
        <div className="space-y-2.5">
          <div className="flex justify-end">
            <div
              className="max-w-[75%] px-3.5 py-2.5 rounded-2xl rounded-tr-sm text-sm"
              style={{
                backgroundColor: "var(--z-gold-muted)",
                border: "1px solid var(--z-border-gold)",
                color: "var(--z-text-primary)",
              }}
            >
              What is the main argument of chapter 3?
            </div>
          </div>
          <div className="flex justify-start gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{
                background:
                  "linear-gradient(135deg, var(--z-gold-dark), var(--z-gold))",
              }}
            >
              <span className="text-xs font-bold" style={{ color: "#0d0d0d" }}>
                Z
              </span>
            </div>
            <div
              className="max-w-[75%] px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-sm"
              style={{
                backgroundColor: "var(--z-bg-elevated)",
                border: "1px solid var(--z-border)",
                color: "var(--z-text-secondary)",
                lineHeight: "1.6",
              }}
            >
              Chapter 3 argues that the Cognitive Revolution enabled Sapiens to
              cooperate in large groups through shared myths and fictional
              narratives...
            </div>
          </div>
        </div>

        {/* Audio player bar */}
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{
            backgroundColor: "var(--z-bg-elevated)",
            border: "1px solid var(--z-border)",
          }}
        >
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200"
            style={{
              background:
                "linear-gradient(135deg, var(--z-gold-dark), var(--z-gold))",
            }}
          >
            <Mic className="w-3.5 h-3.5" style={{ color: "#0d0d0d" }} />
          </button>
          {/* Waveform */}
          <div className="flex-1 flex items-center gap-0.5 h-6">
            {[
              4, 8, 12, 6, 14, 10, 5, 9, 13, 7, 11, 4, 8, 12, 6, 14, 10, 5, 9,
              7,
            ].map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-full flex-1 transition-all duration-150"
                style={{
                  height: `${h}px`,
                  backgroundColor:
                    i < 9 ? "var(--z-gold)" : "var(--z-bg-overlay)",
                  opacity: i < 9 ? 1 : 0.6,
                }}
              />
            ))}
          </div>
          <span
            className="text-xs shrink-0"
            style={{ color: "var(--z-text-muted)" }}
          >
            0:23 / 1:47
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: "var(--z-bg-base)" }}
    >
      {/* Background glow effects */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-125 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(201,168,76,0.07) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-200 h-125 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at bottom right, rgba(201,168,76,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.018] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--z-gold) 1px, transparent 1px), linear-gradient(90deg, var(--z-gold) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 w-full pt-24 pb-16 lg:pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div className="space-y-8">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2">
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: "var(--z-gold-muted)",
                  border: "1px solid var(--z-border-gold)",
                  color: "var(--z-gold)",
                }}
              >
                <Zap className="w-3 h-3" />
                Powered by RAG · Whisper · Claude
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1
                className="text-5xl sm:text-6xl font-bold leading-[1.05] tracking-tight"
                style={{ color: "var(--z-text-primary)" }}
              >
                Your AI voice
                <br />
                <span
                  style={{
                    color: "var(--z-gold)",
                    textShadow: "0 0 40px rgba(201,168,76,0.3)",
                  }}
                >
                  reading assistant.
                </span>
              </h1>
              <p
                className="text-lg leading-relaxed max-w-lg"
                style={{ color: "var(--z-text-muted)" }}
              >
                Upload any PDF and have a hands-free, voice-first conversation
                with it — page-accurate answers, in 5 languages, in seconds.
              </p>
            </div>

            {/* CTA group */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  backgroundColor: "var(--z-gold)",
                  color: "#0d0d0d",
                  boxShadow:
                    "0 0 24px rgba(201,168,76,0.3), 0 4px 12px rgba(0,0,0,0.4)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--z-gold-light)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 0 36px rgba(201,168,76,0.45), 0 8px 20px rgba(0,0,0,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--z-gold)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 0 24px rgba(201,168,76,0.3), 0 4px 12px rgba(0,0,0,0.4)";
                }}
              >
                Start for free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  color: "var(--z-text-secondary)",
                  border: "1px solid var(--z-border)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--z-border-gold)";
                  e.currentTarget.style.color = "var(--z-gold)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--z-border)";
                  e.currentTarget.style.color = "var(--z-text-secondary)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                See how it works
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 pt-2">
              {[
                { value: "2 books", label: "free to start" },
                { value: "< 1s", label: "answer latency" },
                { value: "5 langs", label: "incl. Arabic RTL" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p
                    className="text-base font-bold"
                    style={{ color: "var(--z-gold)" }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--z-text-muted)" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — product preview */}
          <div className="relative lg:pl-8">
            {/* Floating label */}
            <div
              className="absolute -top-4 -right-2 sm:right-4 z-10 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: "var(--z-gold-muted)",
                border: "1px solid var(--z-border-gold)",
                color: "var(--z-gold)",
                backdropFilter: "blur(8px)",
              }}
            >
              Live demo ✦
            </div>
            <ProductPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
