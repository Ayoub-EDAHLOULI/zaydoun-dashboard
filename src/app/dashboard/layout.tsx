import AppShell from "@/components/Shell/AppShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Zaydoun",
  },
  description:
    "Manage your books, conversations, and AI reading companion settings.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell area="admin">{children}</AppShell>;
}
