import type { Metadata } from "next";
import { localeOf, titleMetadata, type LocaleParams } from "@/i18n/metadata";

export async function generateMetadata(props: LocaleParams): Promise<Metadata> {
  return titleMetadata(await localeOf(props), "users");
}

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
