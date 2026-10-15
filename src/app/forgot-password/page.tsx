"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";
import { z } from "zod";
import { Button, Input } from "@/components/ui";
import { AuthCardLayout } from "@/components/Auth/AuthLayout";
import { authService } from "@/lib/api/services/auth.service";
import { useToast } from "@/contexts/ToastContext";

const emailSchema = z.email("Enter a full email address.");

function BackToLogin() {
  return (
    <Link
      href="/login"
      className="inline-flex min-h-11 items-center gap-2 self-start rounded-sm text-sm text-text-secondary hover:text-text-primary"
    >
      <ArrowLeft size={16} aria-hidden />
      Back to log in
    </Link>
  );
}

export default function ForgotPasswordPage() {
  const { notify } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const send = async (address: string) => {
    setBusy(true);
    try {
      // The API answers the same whether or not the email exists
      await authService.forgotPassword(address);
      setSentTo(address);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Couldn't send the link", "error");
    } finally {
      setBusy(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email.trim());
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    void send(parsed.data);
  };

  if (sentTo) {
    return (
      <AuthCardLayout
        eyebrow="Link sent"
        icon={<MailCheck size={24} aria-hidden />}
        title="Check your inbox"
      >
        <p className="text-15 leading-relaxed text-text-secondary">
          If an account exists for{" "}
          <span className="font-medium text-text-primary">{sentTo}</span>, a reset link is on its
          way. It works for one hour.
        </p>
        <p className="text-sm text-text-secondary">
          Nothing after a few minutes? Check spam, or{" "}
          <button
            type="button"
            onClick={() => {
              void send(sentTo);
              notify("Sent again", "info");
            }}
            disabled={busy}
            className="rounded-xs text-gold-light hover:text-text-primary disabled:opacity-50"
          >
            send it again
          </button>
          .
        </p>
        <BackToLogin />
      </AuthCardLayout>
    );
  }

  return (
    <AuthCardLayout eyebrow="Forgot password" title="Forgot your password?">
      <form onSubmit={submit} noValidate className="flex flex-col gap-4.5">
        <p className="text-15 leading-relaxed text-text-secondary">
          Enter your email and we&apos;ll send you a link to set a new one.
        </p>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(undefined);
          }}
          error={error}
          disabled={busy}
          autoFocus
        />
        <Button type="submit" size="lg" fullWidth loading={busy}>
          Send reset link
        </Button>
        <span className="self-center">
          <BackToLogin />
        </span>
      </form>
    </AuthCardLayout>
  );
}
