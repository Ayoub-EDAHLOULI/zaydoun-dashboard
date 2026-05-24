"use client";

import {
  Zap,
  Mic2,
  LayoutDashboard,
  BookOpen,
  Globe,
  Shield,
} from "lucide-react";

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
    title: "Admin + Reader Portals",
    description:
      "Separate admin and user workspaces. Admins monitor all usage, costs and users — while readers get a clean, focused library with no distractions.",
    accent: "var(--z-success)",
    accentBg: "rgba(76,175,125,0.12)",
    accentBorder: "rgba(76,175,125,0.25)",
    tags: ["Admin console", "User portal", "Role-based"],
  },
  {
    icon: Globe,
    title: "5 Languages, Natively",
    description:
      "English, Arabic (full RTL), French, Spanish, and Chinese — upload in any, converse in any. The model adapts to your language, not the other way around.",
    accent: "var(--z-warning)",
    accentBg: "rgba(230,168,23,0.12)",
    accentBorder: "rgba(230,168,23,0.25)",
    tags: ["Arabic RTL", "5 languages", "Auto-detect"],
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
        backgroundColor: "rgba(26,26,26,0.6)",
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
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
        style={{
          backgroundColor: accentBg,
          border: `1px solid ${accentBorder}`,
        }}
      >
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>

      {/* Content */}
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

      {/* Tags */}
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

export default function Features() {
  return (
    <section
      id="features"
      className="py-24 sm:py-32"
      style={{ backgroundColor: "var(--z-bg-base)" }}
    >
      {/* Separator line */}
      <div
        className="max-w-6xl mx-auto px-5 sm:px-8 mb-16"
        style={{ borderTop: "1px solid var(--z-border)" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-12">
          <div className="space-y-3">
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: "var(--z-gold)" }}
            >
              Why Zaydoun
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ color: "var(--z-text-primary)" }}
            >
              Built for serious readers.
              <br />
              <span style={{ color: "var(--z-text-muted)", fontWeight: 400 }}>
                Powered by serious tech.
              </span>
            </h2>
          </div>
          <p
            className="text-sm max-w-xs leading-relaxed sm:text-right"
            style={{ color: "var(--z-text-muted)" }}
          >
            Every feature was designed around the real friction of understanding
            dense books — not just chatting with a PDF.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
