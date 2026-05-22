import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conversations",
  description: "View and manage your AI conversations across all books.",
};

export default function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
