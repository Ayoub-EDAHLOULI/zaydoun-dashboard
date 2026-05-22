"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { useToast } from "@/contexts/ToastContext";
import { authService } from "@/lib/api/services/auth.service";
import Image from "next/image";

const schema = z.object({
  email: z.email("Invalid email address"),
});

export default function ForgotPasswordPage() {
  const { notify } = useToast();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(undefined);

    const result = schema.safeParse({ email });
    if (!result.success) {
      setEmailError(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      notify(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{
        backgroundColor: "var(--z-bg-base)",
        fontFamily: "var(--z-font-sans)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link href="/login" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Zaydoun logo"
              width={30}
              height={30}
              unoptimized
            />
            <span
              className="text-xl font-bold tracking-wide"
              style={{ color: "var(--z-text-primary)" }}
            >
              Zaydoun
            </span>
          </Link>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            backgroundColor: "var(--z-bg-elevated)",
            border: "1px solid var(--z-border)",
            boxShadow: "var(--z-shadow-lg)",
          }}
        >
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-4"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
                  style={{ backgroundColor: "rgba(74,197,130,0.12)" }}
                >
                  <CheckCircle2
                    className="w-7 h-7"
                    style={{ color: "#4ac582" }}
                  />
                </div>
                <div>
                  <h2
                    className="text-xl font-bold"
                    style={{ color: "var(--z-text-primary)" }}
                  >
                    Check your inbox
                  </h2>
                  <p
                    className="text-sm mt-2 leading-relaxed"
                    style={{ color: "var(--z-text-muted)" }}
                  >
                    If an account exists for{" "}
                    <span style={{ color: "var(--z-text-primary)" }}>
                      {email}
                    </span>
                    , you&apos;ll receive a reset link shortly. The link expires
                    in 1 hour.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors mt-2"
                  style={{ color: "var(--z-gold)" }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="mb-6">
                  <h2
                    className="text-xl font-bold"
                    style={{ color: "var(--z-text-primary)" }}
                  >
                    Forgot your password?
                  </h2>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--z-text-muted)" }}
                  >
                    Enter your email and we&apos;ll send you a reset link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1.5"
                      style={{ color: "var(--z-text-secondary)" }}
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                        style={{ color: "var(--z-text-muted)" }}
                      />
                      <input
                        type="text"
                        inputMode="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError(undefined);
                        }}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-150"
                        style={{
                          backgroundColor: "var(--z-bg-surface)",
                          border: `1.5px solid ${emailError ? "var(--z-error)" : "var(--z-border)"}`,
                          color: "var(--z-text-primary)",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = emailError
                            ? "var(--z-error)"
                            : "var(--z-gold)";
                          e.currentTarget.style.boxShadow = emailError
                            ? "0 0 0 3px rgba(224,92,92,0.1)"
                            : "0 0 0 3px rgba(201,168,76,0.1)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = emailError
                            ? "var(--z-error)"
                            : "var(--z-border)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>
                    <AnimatePresence>
                      {emailError && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-xs font-medium mt-1.5"
                          style={{ color: "var(--z-error)" }}
                        >
                          {emailError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "var(--z-gold)",
                      color: "#0d0d0d",
                      boxShadow: "var(--z-shadow-gold)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading)
                        e.currentTarget.style.backgroundColor =
                          "var(--z-gold-light)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--z-gold)";
                    }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Send reset link"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                    style={{ color: "var(--z-text-muted)" }}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to sign in
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
