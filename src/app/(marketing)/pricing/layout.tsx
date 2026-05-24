import type { Metadata } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zaydoun.ai";

export const metadata: Metadata = {
  title: "Pricing — Free AI Voice Reading App | Chat with PDFs",
  description:
    "Start free with 2 books and 15 daily voice messages. Upgrade to Premium Scholar for unlimited books and conversations. No credit card required.",
  alternates: {
    canonical: `${APP_URL}/pricing`,
  },
  openGraph: {
    title: "Pricing — Free AI Voice Reading App | Chat with PDFs",
    description:
      "Start free with 2 books and 15 daily voice messages. Upgrade to Premium Scholar for unlimited access. No credit card required.",
    url: `${APP_URL}/pricing`,
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — Free AI Voice Reading App | Chat with PDFs",
    description:
      "Start free — 2 books, 15 voice messages/day. Premium Scholar at $9.99/mo for unlimited access.",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
