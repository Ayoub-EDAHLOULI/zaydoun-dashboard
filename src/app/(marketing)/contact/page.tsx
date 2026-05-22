// app/(marketing)/contact/page.tsx
"use client";

import { useState } from "react";
import { Mail, MessageSquare, User, Send, CheckCircle2 } from "lucide-react";
import LandingNav from "@/components/Landing/LandingNav";
import LandingFooter from "@/components/Landing/LandingFooter";

const TOPICS = [
  "General question",
  "Bug report",
  "Feature request",
  "Billing",
  "Other",
];

type Field = "name" | "email" | "topic" | "message";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: TOPICS[0],
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [focused, setFocused] = useState<Field | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Partial<Record<Field, string>> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email.";
    if (!form.message.trim()) e.message = "Message is required.";
    else if (form.message.trim().length < 10)
      e.message = "Message must be at least 10 characters.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    // Simulate network delay — replace with real API call
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  }

  function fieldStyle(field: Field) {
    const isFocused = focused === field;
    const hasError = !!errors[field];
    return {
      backgroundColor: "var(--z-bg-elevated)",
      border: `1px solid ${hasError ? "var(--z-error, #e05c5c)" : isFocused ? "var(--z-border-gold)" : "var(--z-border)"}`,
      color: "var(--z-text-primary)",
      outline: "none",
      boxShadow:
        isFocused && !hasError ? "0 0 0 3px rgba(201,168,76,0.1)" : "none",
      transition: "border-color 150ms, box-shadow 150ms",
    };
  }

  return (
    <div
      style={{ backgroundColor: "var(--z-bg-base)", minHeight: "100vh" }}
      className="flex flex-col"
    >
      <LandingNav />

      <main className="grow pt-32 pb-24 max-w-6xl mx-auto px-5 sm:px-8 w-full">
        {/* Header */}
        <div
          className="mb-16"
          style={{ borderTop: "1px solid var(--z-border)" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-12">
            <div className="space-y-3">
              <p
                className="text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: "var(--z-gold)" }}
              >
                Get in touch
              </p>
              <h1
                className="text-3xl sm:text-4xl font-bold"
                style={{ color: "var(--z-text-primary)" }}
              >
                We&apos;d love to hear
                <br />
                <span style={{ color: "var(--z-text-muted)", fontWeight: 400 }}>
                  from you.
                </span>
              </h1>
            </div>
            <p
              className="text-sm max-w-xs leading-relaxed sm:text-right"
              style={{ color: "var(--z-text-muted)" }}
            >
              Typically reply within one business day.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Left — info cards */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {[
              {
                icon: Mail,
                label: "Email us",
                value: "support@zaydoun.ai",
                sub: "For billing, account, and general help.",
              },
              {
                icon: MessageSquare,
                label: "Feature requests",
                value: "feedback@zaydoun.ai",
                sub: "Tell us what you want to see next.",
              },
            ].map(({ icon: Icon, label, value, sub }) => (
              <div
                key={label}
                className="flex items-start gap-4 p-5 rounded-2xl"
                style={{
                  backgroundColor: "rgba(26,26,26,0.5)",
                  border: "1px solid var(--z-border)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: "var(--z-gold-muted)",
                    border: "1px solid var(--z-border-gold)",
                  }}
                >
                  <Icon
                    className="w-4.5 h-4.5"
                    style={{ color: "var(--z-gold)" }}
                  />
                </div>
                <div>
                  <p
                    className="text-xs font-semibold tracking-wide uppercase mb-0.5"
                    style={{ color: "var(--z-text-muted)" }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--z-text-primary)" }}
                  >
                    {value}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--z-text-muted)" }}
                  >
                    {sub}
                  </p>
                </div>
              </div>
            ))}

            {/* Response time note */}
            <div
              className="p-5 rounded-2xl"
              style={{
                backgroundColor: "rgba(26,26,26,0.5)",
                border: "1px solid var(--z-border)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" style={{ color: "var(--z-gold)" }} />
                <p
                  className="text-xs font-semibold tracking-wide uppercase"
                  style={{ color: "var(--z-text-muted)" }}
                >
                  A real human reads every message
                </p>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--z-text-secondary)" }}
              >
                No bots, no ticket queues. Every message goes directly to the
                Zaydoun team and we respond personally.
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3">
            <div
              className="rounded-2xl p-7 sm:p-9"
              style={{
                backgroundColor: "rgba(26,26,26,0.5)",
                border: "1px solid var(--z-border)",
                backdropFilter: "blur(12px)",
              }}
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: "rgba(76,175,125,0.12)",
                      border: "1px solid rgba(76,175,125,0.3)",
                    }}
                  >
                    <CheckCircle2
                      className="w-7 h-7"
                      style={{ color: "#4caf7d" }}
                    />
                  </div>
                  <div className="space-y-1">
                    <p
                      className="text-base font-semibold"
                      style={{ color: "var(--z-text-primary)" }}
                    >
                      Message sent!
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: "var(--z-text-muted)" }}
                    >
                      We&apos;ll get back to you at{" "}
                      <span style={{ color: "var(--z-text-secondary)" }}>
                        {form.email}
                      </span>{" "}
                      within one business day.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setForm({
                        name: "",
                        email: "",
                        topic: TOPICS[0],
                        message: "",
                      });
                      setSubmitted(false);
                    }}
                    className="mt-2 text-xs font-medium transition-colors"
                    style={{ color: "var(--z-text-muted)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--z-gold)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--z-text-muted)")
                    }
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="flex flex-col gap-5"
                >
                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-xs font-medium"
                        style={{ color: "var(--z-text-secondary)" }}
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Zayd Al-Nouri"
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused(null)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm placeholder:text-zinc-600"
                        style={fieldStyle("name")}
                      />
                      {errors.name && (
                        <p
                          className="text-xs"
                          style={{ color: "var(--z-error, #e05c5c)" }}
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-xs font-medium"
                        style={{ color: "var(--z-text-secondary)" }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="zayd@example.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm placeholder:text-zinc-600"
                        style={fieldStyle("email")}
                      />
                      {errors.email && (
                        <p
                          className="text-xs"
                          style={{ color: "var(--z-error, #e05c5c)" }}
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Topic */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-xs font-medium"
                      style={{ color: "var(--z-text-secondary)" }}
                    >
                      Topic
                    </label>
                    <select
                      value={form.topic}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, topic: e.target.value }))
                      }
                      onFocus={() => setFocused("topic")}
                      onBlur={() => setFocused(null)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm"
                      style={fieldStyle("topic")}
                    >
                      {TOPICS.map((t) => (
                        <option
                          key={t}
                          value={t}
                          style={{ backgroundColor: "var(--z-bg-elevated)" }}
                        >
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-xs font-medium"
                      style={{ color: "var(--z-text-secondary)" }}
                    >
                      Message
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Tell us what's on your mind..."
                      value={form.message}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, message: e.target.value }))
                      }
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm placeholder:text-zinc-600 resize-none"
                      style={fieldStyle("message")}
                    />
                    {errors.message && (
                      <p
                        className="text-xs"
                        style={{ color: "var(--z-error, #e05c5c)" }}
                      >
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "var(--z-gold)",
                      color: "#0d0d0d",
                      boxShadow: "0 0 20px rgba(201,168,76,0.25)",
                    }}
                    onMouseEnter={(e) => {
                      if (loading) return;
                      e.currentTarget.style.backgroundColor =
                        "var(--z-gold-light)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 24px rgba(201,168,76,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--z-gold)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 0 20px rgba(201,168,76,0.25)";
                    }}
                  >
                    {loading ? (
                      <>
                        <span
                          className="w-4 h-4 rounded-full border-2 animate-spin"
                          style={{
                            borderColor: "#0d0d0d",
                            borderTopColor: "transparent",
                          }}
                        />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
