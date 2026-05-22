import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/contexts/AuthContext";
import ToastProvider from "@/contexts/ToastContext";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zaydoun.ai";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Zaydoun — Speak to Your Library",
    template: "%s | Zaydoun",
  },
  description:
    "Zaydoun is an AI-powered voice reading companion. Upload books, ask questions, and have natural conversations with your library — in any language.",
  keywords: [
    "AI reading",
    "book companion",
    "voice assistant",
    "RAG",
    "Zaydoun",
  ],
  authors: [{ name: "Zaydoun" }],
  creator: "Zaydoun",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "Zaydoun",
    title: "Zaydoun — Speak to Your Library",
    description:
      "AI-powered voice reading companion. Upload books and have natural conversations about them in any language.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Zaydoun — AI Reading Companion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zaydoun — Speak to Your Library",
    description:
      "AI-powered voice reading companion. Upload books and have natural conversations about them in any language.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
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
