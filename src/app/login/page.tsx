"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { getDashboardPath } from "@/lib/routes";
import Image from "next/image";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDeactivated = searchParams.get("deactivated") === "1";
  const { login } = useAuth();
  const { notify } = useToast();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<LoginFormData> = {};
      validation.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as keyof LoginFormData] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(formData);
      notify("Welcome back!", "success");
      router.push(getDashboardPath(user.role));
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Invalid credentials";
      notify(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: "var(--z-bg-base)",
        fontFamily: "var(--z-font-sans)",
      }}
    >
      {/* LEFT — branding panel */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-14 relative overflow-hidden"
        style={{ backgroundColor: "var(--z-bg-surface)" }}
      >
        {/* Gold glow top-right */}
        <div
          className="absolute -top-40 -right-40 w-125 h-125 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(201,168,76,0.12), transparent 70%)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(var(--z-gold) 1px, transparent 1px), linear-gradient(90deg, var(--z-gold) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Logo */}
        <Link href="/" className="relative z-10 flex gap-3">
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

        {/* Headline */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-4">
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: "var(--z-gold)" }}
            >
              AI Reading Companion
            </p>
            <h1
              className="text-4xl font-bold leading-tight"
              style={{ color: "var(--z-text-primary)" }}
            >
              Your books,
              <br />
              <span style={{ color: "var(--z-gold)" }}>
                intelligently indexed.
              </span>
            </h1>
            <p
              className="text-base leading-relaxed max-w-sm"
              style={{ color: "var(--z-text-muted)" }}
            >
              Upload any PDF and have a context-aware conversation with it —
              page by page, in any language.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { label: "Page-level RAG", sub: "Precise retrieval" },
              { label: "Arabic Support", sub: "Native RTL" },
              { label: "pgvector", sub: "Semantic search" },
              { label: "Conversations", sub: "Full history" },
            ].map((f) => (
              <div
                key={f.label}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: "var(--z-bg-elevated)",
                  border: "1px solid var(--z-border)",
                }}
              >
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--z-text-primary)" }}
                >
                  {f.label}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--z-text-muted)" }}
                >
                  {f.sub}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p
          className="relative z-10 text-xs"
          style={{ color: "var(--z-text-disabled)" }}
        >
          {new Date().getFullYear()} Zaydoun. All rights reserved.
        </p>
      </div>

      {/* RIGHT — form panel */}
      <div
        className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-14"
        style={{ backgroundColor: "var(--z-bg-base)" }}
      >
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden mb-10 flex gap-3">
          <Image
            src="/logo.png"
            alt="Zaydoun logo"
            width={30}
            height={30}
            unoptimized
          />
          <span
            className="text-xl font-bold"
            style={{ color: "var(--z-text-primary)" }}
          >
            Zaydoun
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <div className="mb-8">
            <h2
              className="text-2xl font-bold"
              style={{ color: "var(--z-text-primary)" }}
            >
              Sign in
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--z-text-muted)" }}
            >
              Access your reading dashboard
            </p>
          </div>

          {isDeactivated && (
            <div
              className="flex items-start gap-3 px-4 py-3 rounded-xl mb-6 text-sm"
              style={{
                backgroundColor: "rgba(224,92,92,0.08)",
                border: "1px solid rgba(224,92,92,0.3)",
                color: "var(--z-error, #e05c5c)",
              }}
            >
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                Your account has been deactivated. Please contact support if you
                think this is a mistake.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
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
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-150"
                  style={{
                    backgroundColor: "var(--z-bg-surface)",
                    border: `1.5px solid ${errors.email ? "var(--z-error)" : "var(--z-border)"}`,
                    color: "var(--z-text-primary)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = errors.email
                      ? "var(--z-error)"
                      : "var(--z-gold)";
                    e.currentTarget.style.boxShadow = errors.email
                      ? "0 0 0 3px rgba(224,92,92,0.1)"
                      : "0 0 0 3px rgba(201,168,76,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.email
                      ? "var(--z-error)"
                      : "var(--z-border)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-medium mt-1.5"
                    style={{ color: "var(--z-error)" }}
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="block text-sm font-medium"
                  style={{ color: "var(--z-text-secondary)" }}
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium transition-colors"
                  style={{ color: "var(--z-gold)" }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "var(--z-text-muted)" }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all duration-150"
                  style={{
                    backgroundColor: "var(--z-bg-surface)",
                    border: `1.5px solid ${errors.password ? "var(--z-error)" : "var(--z-border)"}`,
                    color: "var(--z-text-primary)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = errors.password
                      ? "var(--z-error)"
                      : "var(--z-gold)";
                    e.currentTarget.style.boxShadow = errors.password
                      ? "0 0 0 3px rgba(224,92,92,0.1)"
                      : "0 0 0 3px rgba(201,168,76,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.password
                      ? "var(--z-error)"
                      : "var(--z-border)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--z-text-muted)" }}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-medium mt-1.5"
                    style={{ color: "var(--z-error)" }}
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 mt-1 rounded-xl text-sm font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--z-gold)",
                color: "#0d0d0d",
                boxShadow: "var(--z-shadow-gold)",
              }}
              onMouseEnter={(e) => {
                if (!isLoading)
                  e.currentTarget.style.backgroundColor = "var(--z-gold-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--z-gold)";
              }}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div
            className="mt-8 pt-6"
            style={{ borderTop: "1px solid var(--z-border)" }}
          >
            <p
              className="text-center text-sm"
              style={{ color: "var(--z-text-muted)" }}
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold transition-colors"
                style={{ color: "var(--z-gold)" }}
              >
                Create one
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
