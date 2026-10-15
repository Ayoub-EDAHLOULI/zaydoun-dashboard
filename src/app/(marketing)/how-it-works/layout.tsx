import type { Metadata } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zaydoun.ai";

const title = "How it works — From a PDF to a conversation";
const description =
  "How Zaydoun reads your PDF page by page, finds the passages that answer your question, replies with the page it used, and talks back on mobile.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${APP_URL}/how-it-works` },
  openGraph: {
    title,
    description,
    url: `${APP_URL}/how-it-works`,
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
