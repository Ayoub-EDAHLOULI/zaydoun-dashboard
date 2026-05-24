import type { Metadata } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zaydoun.ai";

export const metadata: Metadata = {
  title: "Contact — Talk to the Zaydoun Team",
  description:
    "Have a question, bug report, or feature request? Reach out to the Zaydoun team directly. Every message is read by a real human — we respond within one business day.",
  alternates: {
    canonical: `${APP_URL}/contact`,
  },
  openGraph: {
    title: "Contact — Talk to the Zaydoun Team",
    description:
      "Have a question or feature request? Reach out to the Zaydoun team. Every message is read by a real human.",
    url: `${APP_URL}/contact`,
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Talk to the Zaydoun Team",
    description:
      "Questions, bugs, feature requests — reach out. Real humans, one business day response time.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
