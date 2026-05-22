"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(13,13,13,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--z-border)"
          : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/logo.png"
            alt="Zaydoun"
            width={26}
            height={26}
            unoptimized
          />
          <span
            className="text-base font-bold tracking-wide"
            style={{ color: "var(--z-text-primary)" }}
          >
            Zaydoun
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: "Features", href: "/features" },
            { label: "Pricing", href: "/pricing" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
              style={{ color: "var(--z-text-muted)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--z-text-primary)";
                e.currentTarget.style.backgroundColor = "var(--z-bg-elevated)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--z-text-muted)";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
            style={{ color: "var(--z-text-secondary)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--z-text-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--z-text-secondary)")
            }
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
            style={{
              backgroundColor: "var(--z-gold)",
              color: "#0d0d0d",
              boxShadow: "0 0 16px rgba(201,168,76,0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--z-gold-light)";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(201,168,76,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--z-gold)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 0 16px rgba(201,168,76,0.25)";
            }}
          >
            Get started free
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: "var(--z-text-muted)" }}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-5 pb-5 pt-1 flex flex-col gap-1"
          style={{
            backgroundColor: "rgba(13,13,13,0.97)",
            borderBottom: "1px solid var(--z-border)",
          }}
        >
          {[
            { label: "Features", href: "/features" },
            { label: "Pricing", href: "/pricing" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 text-sm font-medium rounded-lg transition-all"
              style={{ color: "var(--z-text-secondary)" }}
            >
              {item.label}
            </Link>
          ))}
          <div
            className="flex flex-col gap-2 mt-2 pt-3"
            style={{ borderTop: "1px solid var(--z-border)" }}
          >
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2.5 text-sm font-medium rounded-lg text-center transition-all"
              style={{
                border: "1px solid var(--z-border)",
                color: "var(--z-text-secondary)",
              }}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2.5 text-sm font-semibold rounded-lg text-center transition-all"
              style={{ backgroundColor: "var(--z-gold)", color: "#0d0d0d" }}
            >
              Get started free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
