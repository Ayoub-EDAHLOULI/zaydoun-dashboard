import type { Metadata } from "next";
import { localeOf, pageMetadata, type LocaleParams } from "@/i18n/metadata";

export async function generateMetadata(props: LocaleParams): Promise<Metadata> {
  return pageMetadata(await localeOf(props), "resetPassword", "/reset-password", { index: false });
}

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
