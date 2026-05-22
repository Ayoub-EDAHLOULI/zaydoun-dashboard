import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Zaydoun",
  description: "Get in touch with the Zaydoun team.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
