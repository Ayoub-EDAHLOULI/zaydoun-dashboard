"use client";

import { useParams } from "next/navigation";
import ChatView from "@/components/Conversations/ChatView";

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  // Keyed so switching conversations starts from a clean state
  return <ChatView key={id} id={id} />;
}
