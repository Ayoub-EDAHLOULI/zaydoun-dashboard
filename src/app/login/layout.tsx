import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Zaydoun",
  description:
    "Sign in to your Zaydoun account to manage your AI reading companion.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
