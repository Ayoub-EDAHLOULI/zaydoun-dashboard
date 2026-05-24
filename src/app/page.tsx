"use client";

import LandingNav from "@/components/Landing/LandingNav";
import Hero from "@/components/Landing/Hero";
import Features from "@/components/Landing/Features";
import HowItWorks from "@/components/Landing/HowItWorks";
import FAQ from "@/components/Landing/FAQ";
import LandingFooter from "@/components/Landing/LandingFooter";

export default function Home() {
  return (
    <div style={{ backgroundColor: "var(--z-bg-base)", minHeight: "100vh" }}>
      <LandingNav />
      <Hero />
      <Features />
      <HowItWorks />
      <FAQ />
      <LandingFooter />
    </div>
  );
}
