"use client";

import Link from "next/link";
import { Check, Zap, ArrowRight } from "lucide-react";
import LandingNav from "@/components/Landing/LandingNav";
import LandingFooter from "@/components/Landing/LandingFooter";

const FREE_FEATURES = [
  "2 books in your library",
  "50 AI questions per month",
  "Voice input (STT) via Whisper",
  "Arabic & English support",
  "Page-accurate citations",
  "Standard response speed",
];

const PRO_FEATURES = [
  "Unlimited books",
  "Unlimited AI questions",
  "Voice input + TTS playback",
  "Arabic & English support",
  "Page-accurate citations",
  "Priority response speed",
  "Conversation history export",
  "Early access to new features",
];

function PricingCard({
  tier,
  price,
  period,
  tagline,
  features,
  cta,
  ctaHref,
  highlighted,
  badge,
}: {
  tier: string;
  price: string;
  period?: string;
  tagline: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
  badge?: string;
}) {
  return (
    <div
      className="relative flex flex-col rounded-2xl p-8 transition-all duration-200"
      style={{
        backgroundColor: highlighted
          ? "var(--z-bg-surface)"
          : "rgba(26,26,26,0.5)",
        border: highlighted
          ? "1px solid var(--z-border-gold)"
          : "1px solid var(--z-border)",
        boxShadow: highlighted
          ? "0 0 0 1px var(--z-border-gold), 0 24px 64px rgba(201,168,76,0.12)"
          : "none",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {badge && (
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase"
          style={{
            backgroundColor: "var(--z-gold)",
            color: "#0d0d0d",
          }}
        >
          {badge}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <p
          className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
          style={{
            color: highlighted ? "var(--z-gold)" : "var(--z-text-muted)",
          }}
        >
          {tier}
        </p>
        <div className="flex items-end gap-1.5 mb-3">
          <span
            className="text-5xl font-bold leading-none"
            style={{ color: "var(--z-text-primary)" }}
          >
            {price}
          </span>
          {period && (
            <span
              className="text-sm mb-1.5"
              style={{ color: "var(--z-text-muted)" }}
            >
              {period}
            </span>
          )}
        </div>
        <p className="text-sm" style={{ color: "var(--z-text-muted)" }}>
          {tagline}
        </p>
      </div>

      {/* CTA */}
      <Link
        href={ctaHref}
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold mb-8 transition-all duration-200"
        style={
          highlighted
            ? {
                backgroundColor: "var(--z-gold)",
                color: "#0d0d0d",
                boxShadow: "0 0 20px rgba(201,168,76,0.3)",
              }
            : {
                border: "1px solid var(--z-border)",
                color: "var(--z-text-secondary)",
                backgroundColor: "transparent",
              }
        }
        onMouseEnter={(e) => {
          if (highlighted) {
            e.currentTarget.style.backgroundColor = "var(--z-gold-light)";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 24px rgba(201,168,76,0.4)";
          } else {
            e.currentTarget.style.borderColor = "var(--z-border-gold)";
            e.currentTarget.style.color = "var(--z-gold)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }
        }}
        onMouseLeave={(e) => {
          if (highlighted) {
            e.currentTarget.style.backgroundColor = "var(--z-gold)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(201,168,76,0.3)";
          } else {
            e.currentTarget.style.borderColor = "var(--z-border)";
            e.currentTarget.style.color = "var(--z-text-secondary)";
            e.currentTarget.style.transform = "translateY(0)";
          }
        }}
      >
        {cta}
        <ArrowRight className="w-4 h-4" />
      </Link>

      {/* Divider */}
      <div
        className="mb-6"
        style={{ borderTop: "1px solid var(--z-border)" }}
      />

      {/* Features */}
      <ul className="flex flex-col gap-3.5 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{
                backgroundColor: highlighted
                  ? "rgba(201,168,76,0.15)"
                  : "rgba(76,175,125,0.12)",
              }}
            >
              <Check
                className="w-3 h-3"
                style={{ color: highlighted ? "var(--z-gold)" : "#4caf7d" }}
              />
            </span>
            <span
              className="text-sm"
              style={{ color: "var(--z-text-secondary)" }}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div style={{ backgroundColor: "var(--z-bg-base)", minHeight: "100vh" }}>
      <LandingNav />

      <main className="max-w-5xl mx-auto px-5 sm:px-8 pt-32 pb-24">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 mb-2">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: "var(--z-gold-muted)",
                border: "1px solid var(--z-border-gold)",
                color: "var(--z-gold)",
              }}
            >
              <Zap className="w-3 h-3" />
              Simple pricing
            </div>
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: "var(--z-text-primary)" }}
          >
            Start free.
            <br />
            <span
              style={{
                color: "var(--z-gold)",
                textShadow: "0 0 40px rgba(201,168,76,0.25)",
              }}
            >
              Upgrade when you&apos;re ready.
            </span>
          </h1>
          <p
            className="text-base max-w-md mx-auto"
            style={{ color: "var(--z-text-muted)" }}
          >
            No credit card required to start. Unlock unlimited books and voice
            playback with Pro.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <PricingCard
            tier="Free"
            price="$0"
            tagline="Everything you need to get started."
            features={FREE_FEATURES}
            cta="Get started free"
            ctaHref="/register"
          />
          <PricingCard
            tier="Pro"
            price="$9.99"
            period="/ month"
            tagline="For readers who want the full experience."
            features={PRO_FEATURES}
            cta="Upgrade to Pro"
            ctaHref="/register"
            highlighted
            badge="Most popular"
          />
        </div>

        {/* FAQ nudge */}
        <p
          className="text-center text-sm mt-12"
          style={{ color: "var(--z-text-disabled)" }}
        >
          Questions?{" "}
          <Link
            href="/login"
            className="transition-colors"
            style={{ color: "var(--z-text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--z-gold)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--z-text-muted)")
            }
          >
            Sign in to your account
          </Link>{" "}
          or reach out at{" "}
          <span style={{ color: "var(--z-text-muted)" }}>
            support@zaydoun.ai
          </span>
        </p>
      </main>

      <LandingFooter />
    </div>
  );
}
