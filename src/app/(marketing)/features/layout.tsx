import type { Metadata } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zaydoun.ai";

export const metadata: Metadata = {
  title: "Features — AI Voice Reading Assistant with RAG & Whisper STT",
  description:
    "Explore Zaydoun's features: RAG-powered page-accurate answers, Whisper voice transcription, TTS playback, 5-language support, and PDF semantic indexing. Built for serious readers.",
  alternates: {
    canonical: `${APP_URL}/features`,
  },
  openGraph: {
    title: "Features — AI Voice Reading Assistant with RAG & Whisper STT",
    description:
      "Explore Zaydoun's features: RAG-powered page-accurate answers, Whisper voice transcription, TTS playback, 5-language support, and PDF semantic indexing.",
    url: `${APP_URL}/features`,
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Features — AI Voice Reading Assistant with RAG & Whisper STT",
    description:
      "RAG-powered answers, Whisper STT, TTS playback, 5 languages. Zaydoun is the AI reading companion built for serious readers.",
  },
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
