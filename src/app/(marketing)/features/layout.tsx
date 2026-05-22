import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features — Zaydoun",
  description:
    "Every feature built around the real friction of understanding dense books.",
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
