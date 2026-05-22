import Link from "next/link";
import Image from "next/image";

export default function LandingFooter() {
  return (
    <footer
      className="py-12"
      style={{
        backgroundColor: "var(--z-bg-base)",
        borderTop: "1px solid var(--z-border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Zaydoun"
            width={22}
            height={22}
            unoptimized
          />
          <span
            className="text-sm font-bold tracking-wide"
            style={{ color: "var(--z-text-primary)" }}
          >
            Zaydoun
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          {[
            { label: "Features", href: "/features" },
            { label: "Pricing", href: "/pricing" },
            { label: "Contact", href: "/contact" },
            { label: "Sign in", href: "/login" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-xs transition-colors"
              style={{ color: "var(--z-text-muted)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--z-text-secondary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--z-text-muted)")
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs" style={{ color: "var(--z-text-disabled)" }}>
          © {new Date().getFullYear()} Zaydoun. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
