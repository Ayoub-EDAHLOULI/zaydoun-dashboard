import type { Metadata } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zaydoun.ai";

const title = "FAQ — Questions about Zaydoun";
const description =
  "Answers about uploading PDFs, page citations, reply languages, hands-free voice, free limits, your account and privacy.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${APP_URL}/faq` },
  openGraph: {
    title,
    description,
    url: `${APP_URL}/faq`,
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
