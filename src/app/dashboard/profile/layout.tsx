import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "View your Zaydoun profile, usage stats, and account settings.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
