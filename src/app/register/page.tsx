"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Loader2 } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { getDashboardPath } from "@/lib/routes";
import { authService } from "@/lib/api/services/auth.service";
import Image from "next/image";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const inputBase =
  "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-150";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="block text-sm font-medium mb-1.5"
        style={{ color: "var(--z-text-secondary)" }}
      >
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs font-medium mt-1.5"
            style={{ color: "var(--z-error)" }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { notify } = useToast();

  const [form, setForm] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const set =
    (field: keyof RegisterFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: undefined }));
    };

  const borderColor = (field: keyof RegisterFormData) =>
    errors[field] ? "var(--z-error)" : "var(--z-border)";

  const focusHandlers = (field: keyof RegisterFormData) => ({
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = errors[field]
        ? "var(--z-error)"
        : "var(--z-gold)";
      e.currentTarget.style.boxShadow = errors[field]
        ? "0 0 0 3px rgba(224,92,92,0.1)"
        : "0 0 0 3px rgba(201,168,76,0.1)";
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = borderColor(field);
      e.currentTarget.style.boxShadow = "none";
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as keyof RegisterFormData] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const { name, email, password } = result.data;
      await authService.register({ name, email, password });
      const user = await login({ email, password });
      notify("Account created!", "success");
      router.push(getDashboardPath(user.role));
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
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
        <div
          className="absolute -top-40 -right-40 w-125 h-125 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(201,168,76,0.12), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(var(--z-gold) 1px, transparent 1px), linear-gradient(90deg, var(--z-gold) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

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
              Start your reading
              <br />
              <span style={{ color: "var(--z-gold)" }}>journey today.</span>
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
              Create account
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--z-text-muted)" }}
            >
              Join Zaydoun and start reading smarter
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <Field label="Full name" error={errors.name}>
              <div className="relative">
                <User
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "var(--z-text-muted)" }}
                />
                <input
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Your name"
                  autoComplete="name"
                  className={inputBase}
                  style={{
                    backgroundColor: "var(--z-bg-surface)",
                    border: `1.5px solid ${borderColor("name")}`,
                    color: "var(--z-text-primary)",
                  }}
                  {...focusHandlers("name")}
                />
              </div>
            </Field>

            {/* Email */}
            <Field label="Email address" error={errors.email}>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "var(--z-text-muted)" }}
                />
                <input
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  className={inputBase}
                  style={{
                    backgroundColor: "var(--z-bg-surface)",
                    border: `1.5px solid ${borderColor("email")}`,
                    color: "var(--z-text-primary)",
                  }}
                  {...focusHandlers("email")}
                />
              </div>
            </Field>

            {/* Password */}
            <Field label="Password" error={errors.password}>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "var(--z-text-muted)" }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className={`${inputBase} pr-10`}
                  style={{
                    backgroundColor: "var(--z-bg-surface)",
                    border: `1.5px solid ${borderColor("password")}`,
                    color: "var(--z-text-primary)",
                  }}
                  {...focusHandlers("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
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
            </Field>

            {/* Confirm Password */}
            <Field label="Confirm password" error={errors.confirmPassword}>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "var(--z-text-muted)" }}
                />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className={`${inputBase} pr-10`}
                  style={{
                    backgroundColor: "var(--z-bg-surface)",
                    border: `1.5px solid ${borderColor("confirmPassword")}`,
                    color: "var(--z-text-primary)",
                  }}
                  {...focusHandlers("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--z-text-muted)" }}
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </Field>

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
                "Create account"
              )}
            </button>
          </form>

          <div
            className="mt-6 pt-6"
            style={{ borderTop: "1px solid var(--z-border)" }}
          >
            <p
              className="text-center text-sm"
              style={{ color: "var(--z-text-muted)" }}
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold transition-colors"
                style={{ color: "var(--z-gold)" }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
