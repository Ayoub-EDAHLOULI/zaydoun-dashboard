// app/(marketing)/pricing/page.tsx
"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import LandingNav from "@/components/Landing/LandingNav";
import LandingFooter from "@/components/Landing/LandingFooter";

const TIERS = [
  {
    name: "Free Pass",
    price: "0",
    description:
      "Perfect for testing Zaydoun with your current reading material.",
    features: [
      "2 Custom Books max storage",
      "15 Voice Messages per day",
      "Sub-second pgvector semantic RAG",
      "Native Arabic & English support",
      "Access to Mobile & Web portals",
    ],
    buttonText: "Start reading free",
    href: "/register",
    featured: false,
  },
  {
    name: "Premium Scholar",
    price: "9.99",
    description:
      "For elite professionals, researchers, and serious intellects.",
    features: [
      "Infinite Library document uploads",
      "Unlimited deep voice conversations",
      "Priority Whisper transcription processing",
      "High-speed dedicated TTS streaming",
      "Advanced cross-book context search",
      "Dedicated early-access support channels",
    ],
    buttonText: "Upgrade your memory",
    href: "/register",
    featured: true,
  },
];

export default function PricingPage() {
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
            Transparent Plans
          </p>
          <h1 className="text-4xl font-bold text-white tracking-tight sm:text-5xl">
            Invest in your understanding.
          </h1>
          <p className="text-zinc-400 max-w-md mx-auto text-sm sm:text-base">
            No hidden fees. Every tier gives you instant access to our advanced
            vector-retrieval pipeline.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="rounded-2xl p-8 flex flex-col justify-between transition-all duration-200"
              style={{
                backgroundColor: "rgba(26,26,26,0.4)",
                border: tier.featured
                  ? "1px solid var(--z-border-gold)"
                  : "1px solid var(--z-border)",
                backdropFilter: "blur(12px)",
                boxShadow: tier.featured
                  ? "0 12px 40px rgba(201,168,76,0.05)"
                  : "none",
              }}
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                  <p className="text-zinc-400 text-sm mt-1 leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-white">
                    ${tier.price}
                  </span>
                  <span className="text-zinc-500 text-sm font-medium">
                    / month
                  </span>
                </div>

                <div className="w-full h-px bg-zinc-800" />

                <ul className="space-y-3.5">
                  {tier.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-3 text-sm text-zinc-300"
                    >
                      <Check
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: "var(--z-gold)" }}
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href={tier.href}
                  className="block w-full py-3 px-4 rounded-xl text-center text-sm font-semibold transition-all duration-200"
                  style={{
                    backgroundColor: tier.featured
                      ? "var(--z-gold)"
                      : "transparent",
                    color: tier.featured ? "#0d0d0d" : "var(--z-text-primary)",
                    border: tier.featured
                      ? "1px solid transparent"
                      : "1px solid var(--z-border)",
                  }}
                  onMouseEnter={(e) => {
                    if (tier.featured) {
                      e.currentTarget.style.backgroundColor =
                        "var(--z-gold-light)";
                    } else {
                      e.currentTarget.style.borderColor =
                        "var(--z-border-gold)";
                      e.currentTarget.style.color = "var(--z-gold)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (tier.featured) {
                      e.currentTarget.style.backgroundColor = "var(--z-gold)";
                    } else {
                      e.currentTarget.style.borderColor = "var(--z-border)";
                      e.currentTarget.style.color = "var(--z-text-primary)";
                    }
                  }}
                >
                  {tier.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
