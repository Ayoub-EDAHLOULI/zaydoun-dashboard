import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/contexts/AuthContext";
import ToastProvider from "@/contexts/ToastContext";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zaydoun.ai";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Zaydoun — AI Voice Assistant for Books | Chat with Any PDF",
    template: "%s | Zaydoun",
  },
  description:
    "Zaydoun is an AI-powered voice reading assistant. Upload any PDF, ask questions hands-free, and get page-accurate answers in 5 languages. Powered by RAG, Whisper STT, and Claude.",
  keywords: [
    // Primary
    "AI voice assistant for reading",
    "chat with PDF using voice",
    "AI book companion app",
    // Secondary
    "hands-free PDF reader AI",
    "RAG PDF question answering",
    "voice AI reading app",
    "multilingual AI assistant",
    "AI study companion",
    // Long-tail
    "how to ask questions about a PDF with AI",
    "AI app that reads books out loud and answers questions",
    "hands-free book reading app for commuting",
    "Arabic AI reading assistant RTL",
    "upload PDF and chat with it using voice",
    "AI assistant that cites page numbers",
    "RAG chatbot for personal library",
    "voice-first AI app for students",
    "AI reading companion for professionals",
    "talk to your books app",
  ],
  authors: [{ name: "Zaydoun", url: APP_URL }],
  creator: "Zaydoun",
  publisher: "Zaydoun",
  category: "Technology",
  applicationName: "Zaydoun",
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "Zaydoun",
    title: "Zaydoun — AI Voice Assistant for Books | Chat with Any PDF",
    description:
      "Upload any PDF and have a deep, voice-first conversation with it. Page-accurate answers in 5 languages — hands-free, powered by RAG and Claude.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Zaydoun — AI Voice Reading Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@zaydounai",
    creator: "@zaydounai",
    title: "Zaydoun — AI Voice Assistant for Books | Chat with Any PDF",
    description:
      "Upload any PDF and have a deep, voice-first conversation with it. Page-accurate answers in 5 languages — hands-free.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  },
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Zaydoun",
  url: APP_URL,
  description:
    "AI-powered voice reading assistant. Upload any PDF and have a deep, voice-first conversation with it — page-accurate answers in 5 languages.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${APP_URL}/app/library?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const jsonLdSoftwareApp = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Zaydoun",
  url: APP_URL,
  applicationCategory: "UtilitiesApplication",
  applicationSubCategory: "AI Voice Assistant",
  operatingSystem: "iOS, Android, Web",
  description:
    "Zaydoun is an AI-powered voice reading assistant. Upload any PDF, ask questions hands-free, and get page-accurate answers in 5 languages using RAG, Whisper STT, and Claude.",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: "Free Pass",
      description: "2 books, 15 voice messages per day",
    },
    {
      "@type": "Offer",
      price: "9.99",
      priceCurrency: "USD",
      name: "Premium Scholar",
      description: "Unlimited books and voice conversations",
    },
  ],
  creator: {
    "@type": "Organization",
    name: "Zaydoun",
    url: APP_URL,
  },
  featureList: [
    "Voice-first hands-free reading",
    "RAG-powered page-accurate answers",
    "Whisper speech-to-text transcription",
    "Text-to-speech playback",
    "5 languages: English, Arabic, French, Spanish, Chinese",
    "Full Arabic RTL rendering",
    "PDF upload and semantic indexing",
    "Conversation history",
  ],
  screenshot: `${APP_URL}/opengraph-image.png`,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "120",
    bestRating: "5",
    worstRating: "1",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdSoftwareApp),
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col antialiased"
        suppressHydrationWarning
      >
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
