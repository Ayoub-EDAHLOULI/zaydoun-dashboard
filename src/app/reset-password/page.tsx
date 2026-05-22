"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { z } from "zod";
import { useToast } from "@/contexts/ToastContext";
import { authService } from "@/lib/api/services/auth.service";
import Image from "next/image";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { notify } = useToast();

  const token = searchParams.get("token");

  const [form, setForm] = useState<FormData>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const set =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: undefined }));
    };

  const borderColor = (field: keyof FormData) =>
    errors[field] ? "var(--z-error)" : "var(--z-border)";

  const focusHandlers = (field: keyof FormData) => ({
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

    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as keyof FormData] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(token!, result.data.password);
      setDone(true);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to reset password";
      notify(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Invalid / missing token
  if (!token) {
    return (
      <div className="text-center space-y-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
          style={{ backgroundColor: "rgba(224,92,92,0.1)" }}
        >
          <AlertTriangle
            className="w-7 h-7"
            style={{ color: "var(--z-error)" }}
          />
        </div>
        <div>
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--z-text-primary)" }}
          >
            Invalid reset link
          </h2>
          <p className="text-sm mt-2" style={{ color: "var(--z-text-muted)" }}>
            This link is missing a reset token. Please request a new one.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
          style={{ color: "var(--z-gold)" }}
        >
          Request new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-4"
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
          style={{ backgroundColor: "rgba(74,197,130,0.12)" }}
        >
          <CheckCircle2 className="w-7 h-7" style={{ color: "#4ac582" }} />
        </div>
        <div>
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--z-text-primary)" }}
          >
            Password updated
          </h2>
          <p className="text-sm mt-2" style={{ color: "var(--z-text-muted)" }}>
            Your password has been reset successfully. You can now sign in with
            your new password.
          </p>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            backgroundColor: "var(--z-gold)",
            color: "#0d0d0d",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--z-gold-light)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--z-gold)")
          }
        >
          Sign in
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6">
        <h2
          className="text-xl font-bold"
          style={{ color: "var(--z-text-primary)" }}
        >
          Set new password
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--z-text-muted)" }}>
          Choose a strong password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New password */}
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--z-text-secondary)" }}
          >
            New password
          </label>
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
              className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all duration-150"
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

        {/* Confirm password */}
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--z-text-secondary)" }}
          >
            Confirm new password
          </label>
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
              className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all duration-150"
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
          <AnimatePresence>
            {errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs font-medium mt-1.5"
                style={{ color: "var(--z-error)" }}
              >
                {errors.confirmPassword}
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
              e.currentTarget.style.backgroundColor = "var(--z-gold-light)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--z-gold)";
          }}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Reset password"
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
  );
}

export default function ResetPasswordPage() {
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
          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <Loader2
                  className="w-6 h-6 animate-spin"
                  style={{ color: "var(--z-gold)" }}
                />
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </motion.div>
    </div>
  );
}
