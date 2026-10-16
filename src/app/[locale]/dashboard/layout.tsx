import type { Metadata } from "next";
import AppShell from "@/components/Shell/AppShell";
import { localeOf, titleMetadata, type LocaleParams } from "@/i18n/metadata";

export async function generateMetadata(props: LocaleParams): Promise<Metadata> {
  return {
    ...(await titleMetadata(await localeOf(props), "dashboard")),
    robots: { index: false, follow: false },
  };
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell area="admin">{children}</AppShell>;
}
