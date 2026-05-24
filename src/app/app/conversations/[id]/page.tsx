"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send, Loader2, BookOpen, FileText } from "lucide-react";
import { conversationsService } from "@/lib/api/services/conversations.service";
import { ConversationDetail, MessageData } from "@/types/conversations.types";
import { useToast } from "@/contexts/ToastContext";

function MessageBubble({ msg }: { msg: MessageData }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{
            background:
              "linear-gradient(135deg, var(--z-gold-dark, #a07c30), var(--z-gold))",
          }}
        >
          <span className="text-xs font-bold" style={{ color: "#0d0d0d" }}>
            Z
          </span>
        </div>
      )}
      <div
        className={`max-w-[75%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
      >
        <div
          className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
          style={
            isUser
              ? {
                  backgroundColor: "var(--z-gold-muted)",
                  border: "1px solid var(--z-border-gold)",
                  color: "var(--z-text-primary)",
                  borderTopRightRadius: "4px",
                }
              : {
                  backgroundColor: "var(--z-bg-elevated)",
                  border: "1px solid var(--z-border)",
                  color: "var(--z-text-secondary)",
                  borderTopLeftRadius: "4px",
                }
          }
        >
          {msg.content}
        </div>
        {msg.sourcePage && (
          <span
            className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md"
            style={{
              backgroundColor: "var(--z-bg-overlay)",
              color: "var(--z-text-muted)",
              border: "1px solid var(--z-border)",
            }}
          >
            <FileText className="w-3 h-3" />
            Page {msg.sourcePage}
          </span>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
        style={{
          background:
            "linear-gradient(135deg, var(--z-gold-dark, #a07c30), var(--z-gold))",
        }}
      >
        <span className="text-xs font-bold" style={{ color: "#0d0d0d" }}>
          Z
        </span>
      </div>
      <div
        className="px-4 py-3 rounded-2xl"
        style={{
          backgroundColor: "var(--z-bg-elevated)",
          border: "1px solid var(--z-border)",
          borderTopLeftRadius: "4px",
        }}
      >
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full animate-bounce"
              style={{
                backgroundColor: "var(--z-gold)",
                animationDelay: `${i * 150}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ConversationChatPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { notify } = useToast();

  const [conversation, setConversation] = useState<ConversationDetail | null>(
    null,
  );
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    conversationsService
      .get(id)
      .then((data) => {
        setConversation(data);
        setMessages(data.messages);
      })
      .catch((err: Error) => {
        notify(err.message, "error");
        router.push("/app/conversations");
      })
      .finally(() => setIsLoading(false));
  }, [id, notify, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    setInput("");
    setIsSending(true);

    const optimisticUser: MessageData = {
      id: `tmp-${Date.now()}`,
      conversationId: id,
      role: "user",
      content: text,
      sourcePage: null,
      audioPath: null,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUser]);

    try {
      const { userMessage, aiMessage } = await conversationsService.chat(
        id,
        text,
        conversation?.languageCode,
      );
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== optimisticUser.id),
        userMessage,
        aiMessage,
      ]);
    } catch (err: unknown) {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticUser.id));
      notify(
        err instanceof Error ? err.message : "Failed to send message",
        "error",
      );
      setInput(text);
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div
          className="w-7 h-7 rounded-full border-2 animate-spin"
          style={{
            borderColor: "var(--z-gold)",
            borderTopColor: "transparent",
          }}
        />
      </div>
    );
  }

  const title = conversation?.title ?? "Untitled conversation";

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-3.5 shrink-0"
        style={{ borderBottom: "1px solid var(--z-border)" }}
      >
        <button
          onClick={() => router.push("/app/conversations")}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors shrink-0"
          style={{ color: "var(--z-text-muted)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--z-bg-elevated)";
            e.currentTarget.style.color = "var(--z-text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--z-text-muted)";
          }}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{
            backgroundColor: "var(--z-gold-muted)",
            border: "1px solid var(--z-border-gold)",
          }}
        >
          <BookOpen className="w-4 h-4" style={{ color: "var(--z-gold)" }} />
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold truncate"
            style={{ color: "var(--z-text-primary)" }}
          >
            {title}
          </p>
          {conversation?.languageCode && (
            <p
              className="text-xs uppercase"
              style={{ color: "var(--z-text-muted)" }}
            >
              {conversation.languageCode}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--z-gold-dark, #a07c30), var(--z-gold))",
              }}
            >
              <span className="text-lg font-bold" style={{ color: "#0d0d0d" }}>
                Z
              </span>
            </div>
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--z-text-primary)" }}
              >
                Ask anything about this book
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--z-text-muted)" }}
              >
                Type a question below to get page-accurate answers.
              </p>
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {isSending && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="shrink-0 px-5 py-4"
        style={{ borderTop: "1px solid var(--z-border)" }}
      >
        <div
          className="flex items-end gap-3 rounded-2xl px-4 py-3"
          style={{
            backgroundColor: "var(--z-bg-elevated)",
            border: "1px solid var(--z-border)",
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor =
              "var(--z-border-gold)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 0 3px rgba(201,168,76,0.08)";
          }}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--z-border)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }
          }}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={autoResize}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about this book…"
            disabled={isSending}
            className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-zinc-600 disabled:opacity-50"
            style={{
              color: "var(--z-text-primary)",
              lineHeight: "1.5",
              minHeight: "24px",
              maxHeight: "160px",
            }}
          />
          <button
            onClick={() => void handleSend()}
            disabled={!input.trim() || isSending}
            className="w-8 h-8 flex items-center justify-center rounded-xl shrink-0 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--z-gold)",
              color: "#0d0d0d",
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled)
                e.currentTarget.style.backgroundColor = "var(--z-gold-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--z-gold)";
            }}
          >
            {isSending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        <p
          className="text-xs text-center mt-2"
          style={{ color: "var(--z-text-muted)" }}
        >
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
