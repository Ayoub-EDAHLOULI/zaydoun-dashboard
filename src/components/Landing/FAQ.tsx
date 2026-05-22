// components/Landing/FAQ.tsx
"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    question: "Is my data private? Who can see my books and conversations?",
    answer:
      "Your books and conversations are completely private. Each user's data is isolated at the database level — no other user, including admins, can read your conversation history or file contents. We use JWT access tokens with httpOnly refresh cookies, bcrypt-hashed passwords, and row-level scoping on every query. We never train on your data.",
  },
  {
    question: "How does page-accurate citation work?",
    answer:
      "When we ingest your PDF, we chunk the text while preserving the original page number of each chunk. When you ask a question, the RAG pipeline retrieves the most semantically relevant chunks and passes them — along with their page numbers — to the model. Every answer includes the exact pages it was drawn from, so you can verify anything in seconds.",
  },
  {
    question: "Does Zaydoun automatically detect my language?",
    answer:
      "Yes. Both Arabic and English are supported natively with automatic detection. Arabic text is rendered with full RTL layout. You can upload a book in Arabic, ask a question in English, and the model will respond in whichever language you used. Mixed-language books are handled gracefully — each chunk is indexed in the language it was written in.",
  },
  {
    question: "What file formats are supported for upload?",
    answer:
      "Currently we support PDF files up to 500 pages. We extract text directly from the PDF layer — not OCR — so digitally-typed PDFs produce the best results. Scanned-image PDFs without a text layer will have limited accuracy. Support for EPUB and DOCX is on our roadmap.",
  },
  {
    question: "How fast are answers? What powers the retrieval?",
    answer:
      "Typical answer latency is under one second from the moment you finish speaking. The retrieval layer uses pgvector with approximate nearest-neighbour (ANN) search over OpenAI embeddings — this gives semantic accuracy with near-zero query overhead. The generation layer runs on a low-latency Claude model endpoint.",
  },
  {
    question: "Can I use Zaydoun on my phone without looking at the screen?",
    answer:
      "That's exactly what it was built for. The mobile portal has a voice-first interface: tap the mic, ask your question, and the answer is read back to you via our TTS engine. You can commute, exercise, or cook — and still move through a book. Screen interaction is completely optional.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ borderBottom: "1px solid var(--z-border)" }}>
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 text-left transition-colors duration-150 group"
        aria-expanded={isOpen}
      >
        <span
          className="text-sm font-medium leading-relaxed flex-1"
          style={{
            color: isOpen ? "var(--z-text-primary)" : "var(--z-text-secondary)",
            transition: "color 150ms",
          }}
        >
          {question}
        </span>
        <span
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 transition-all duration-200"
          style={{
            backgroundColor: isOpen
              ? "var(--z-gold-muted)"
              : "var(--z-bg-overlay)",
            border: `1px solid ${isOpen ? "var(--z-border-gold)" : "var(--z-border)"}`,
            color: isOpen ? "var(--z-gold)" : "var(--z-text-muted)",
          }}
        >
          {isOpen ? (
            <Minus className="w-3 h-3" />
          ) : (
            <Plus className="w-3 h-3" />
          )}
        </span>
      </button>

      {/* Animated answer panel */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 250ms ease-out",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <p
            className="text-sm leading-relaxed pb-5"
            style={{ color: "var(--z-text-muted)" }}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) =>
    setOpenIndex((prev) => (prev === idx ? null : idx));

  return (
    <section
      className="py-24 sm:py-32"
      style={{ backgroundColor: "var(--z-bg-base)" }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section header */}
        <div
          className="mb-16 pb-12"
          style={{ borderTop: "1px solid var(--z-border)" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-12">
            <div className="space-y-3">
              <p
                className="text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: "var(--z-gold)" }}
              >
                Got questions
              </p>
              <h2
                className="text-3xl sm:text-4xl font-bold"
                style={{ color: "var(--z-text-primary)" }}
              >
                Everything you need
                <br />
                <span style={{ color: "var(--z-text-muted)", fontWeight: 400 }}>
                  to make the call.
                </span>
              </h2>
            </div>
            <p
              className="text-sm max-w-xs leading-relaxed sm:text-right"
              style={{ color: "var(--z-text-muted)" }}
            >
              Still unsure? Start on the free tier — no credit card, no
              commitment.
            </p>
          </div>
        </div>

        {/* Two-column FAQ grid on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
          {/* Left column */}
          <div style={{ borderTop: "1px solid var(--z-border)" }}>
            {FAQS.slice(0, Math.ceil(FAQS.length / 2)).map((faq, idx) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === idx}
                onToggle={() => toggle(idx)}
              />
            ))}
          </div>

          {/* Right column */}
          <div style={{ borderTop: "1px solid var(--z-border)" }}>
            {FAQS.slice(Math.ceil(FAQS.length / 2)).map((faq, idx) => {
              const globalIdx = Math.ceil(FAQS.length / 2) + idx;
              return (
                <FAQItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === globalIdx}
                  onToggle={() => toggle(globalIdx)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
