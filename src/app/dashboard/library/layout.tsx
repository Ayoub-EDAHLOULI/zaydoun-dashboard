import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Library",
  description:
    "Upload and manage your books. Process them for AI-powered conversations.",
};

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
