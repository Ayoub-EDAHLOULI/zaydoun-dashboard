import DashboardLayout from "@/components/Dashboard/Layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Zaydoun",
  description: "AI-powered reading companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
