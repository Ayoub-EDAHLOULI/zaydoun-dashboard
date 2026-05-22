// app/(marketing)/features/page.tsx
"use client";

import Link from "next/link";
import {
  Zap,
  Mic2,
  LayoutDashboard,
  BookOpen,
  Globe,
  Shield,
  ArrowRight,
} from "lucide-react";
import LandingNav from "@/components/Landing/LandingNav";
import LandingFooter from "@/components/Landing/LandingFooter";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant RAG Retrieval",
    description:
      "pgvector-powered semantic search returns page-accurate answers in under a second. No hallucinations — every response is grounded in your book's exact content.",
    accent: "var(--z-gold)",
    accentBg: "var(--z-gold-muted)",
    accentBorder: "var(--z-border-gold)",
    tags: ["pgvector", "Semantic search", "Sub-second"],
  },
  {
    icon: Mic2,
    title: "Voice-First Experience",
    description:
      "Speak your questions aloud with Whisper STT and hear answers via our TTS engine. Read hands-free on commutes, workouts, or anywhere a screen is inconvenient.",
    accent: "var(--z-info)",
    accentBg: "rgba(91,155,213,0.12)",
    accentBorder: "rgba(91,155,213,0.25)",
    tags: ["Whisper STT", "TTS playback", "Hands-free"],
  },
  {
    icon: LayoutDashboard,
    title: "Dual-Hub Architecture",
    description:
      "Separate admin and user workspaces. Admins monitor all usage, costs and users — while readers get a clean, focused library with no distractions.",
    accent: "var(--z-success)",
    accentBg: "rgba(76,175,125,0.12)",
    accentBorder: "rgba(76,175,125,0.25)",
    tags: ["Admin console", "User portal", "Role-based"],
  },
  {
    icon: Globe,
    title: "Arabic & English Native",
    description:
      "Full RTL rendering for Arabic text. Upload books in either language and converse naturally — the model adapts to your language, not the other way around.",
    accent: "var(--z-warning)",
    accentBg: "rgba(230,168,23,0.12)",
    accentBorder: "rgba(230,168,23,0.25)",
    tags: ["Arabic RTL", "Bilingual", "Auto-detect"],
  },
  {
    icon: BookOpen,
    title: "PDF-First Ingestion",
    description:
      "Drag, drop, done. We extract, chunk, and embed your entire PDF — preserving page numbers so every cited answer links back to the exact source page.",
    accent: "var(--z-gold)",
    accentBg: "var(--z-gold-muted)",
    accentBorder: "var(--z-border-gold)",
    tags: ["PDF parsing", "Page citations", "Auto-embed"],
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your books and conversations are yours alone. JWT + httpOnly refresh tokens, bcrypt-hashed passwords, and per-user isolation at the database layer.",
    accent: "var(--z-success)",
    accentBg: "rgba(76,175,125,0.12)",
    accentBorder: "rgba(76,175,125,0.25)",
    tags: ["JWT auth", "bcrypt", "Isolated data"],
  },
];

function FeatureCard({
  icon: Icon,
  title,
  description,
  accent,
  accentBg,
  accentBorder,
  tags,
}: (typeof FEATURES)[0]) {
  return (
    <div
      className="group rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 cursor-default"
      style={{
        backgroundColor: "rgba(26,26,26,0.5)",
        border: "1px solid var(--z-border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-4px)";
        el.style.borderColor = accentBorder;
        el.style.boxShadow = `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${accentBorder}`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(0)";
        el.style.borderColor = "var(--z-border)";
        el.style.boxShadow = "none";
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{
          backgroundColor: accentBg,
          border: `1px solid ${accentBorder}`,
        }}
      >
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>

      <div className="flex-1 space-y-2">
        <h3
          className="text-base font-semibold"
          style={{ color: "var(--z-text-primary)" }}
        >
          {title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--z-text-muted)" }}
        >
          {description}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-md font-medium"
            style={{
              backgroundColor: "var(--z-bg-overlay)",
              color: "var(--z-text-muted)",
              border: "1px solid var(--z-border)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <div
      style={{ backgroundColor: "var(--z-bg-base)", minHeight: "100vh" }}
      className="flex flex-col"
    >
      <LandingNav />

      <main className="grow pt-32 pb-24 max-w-6xl mx-auto px-5 sm:px-8 w-full">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ color: "var(--z-gold)" }}
          >
            Why Zaydoun
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: "var(--z-text-primary)" }}
          >
            Built for serious readers.
            <br />
            <span style={{ color: "var(--z-text-muted)", fontWeight: 400 }}>
              Powered by serious tech.
            </span>
          </h1>
          <p
            className="text-sm max-w-md mx-auto"
            style={{ color: "var(--z-text-muted)" }}
          >
            Every feature was designed around the real friction of understanding
            dense books — not just chatting with a PDF.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>

        {/* CTA strip */}
        <div
          className="mt-16 rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{
            backgroundColor: "rgba(26,26,26,0.5)",
            border: "1px solid var(--z-border-gold)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="space-y-1 text-center sm:text-left">
            <p
              className="text-lg font-bold"
              style={{ color: "var(--z-text-primary)" }}
            >
              Ready to talk to your books?
            </p>
            <p className="text-sm" style={{ color: "var(--z-text-muted)" }}>
              Start free — no credit card required.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/pricing"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                border: "1px solid var(--z-border)",
                color: "var(--z-text-secondary)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--z-border-gold)";
                e.currentTarget.style.color = "var(--z-gold)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--z-border)";
                e.currentTarget.style.color = "var(--z-text-secondary)";
              }}
            >
              See pricing
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                backgroundColor: "var(--z-gold)",
                color: "#0d0d0d",
                boxShadow: "0 0 20px rgba(201,168,76,0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--z-gold-light)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 24px rgba(201,168,76,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--z-gold)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(201,168,76,0.3)";
              }}
            >
              Get started free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
