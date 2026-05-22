import AppLayout from "@/components/App/AppLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Zaydoun",
    template: "%s | Zaydoun",
  },
  description: "Your AI reading companion — chat with your books.",
};

export default function UserAppRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
