"use client";

import { Link } from "@/i18n/navigation";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, MailCheck } from "lucide-react";
import { z } from "zod";
import { Button, Input } from "@/components/ui";
import { AuthCardLayout } from "@/components/Auth/AuthLayout";
import { authService } from "@/lib/api/services/auth.service";
import { useToast } from "@/contexts/ToastContext";

// Message is a key in common.json → "validation"
const emailSchema = z.email("emailInvalid");

function BackToLogin() {
  const t = useTranslations("auth.forgot");
  return (
    <Link
      href="/login"
      className="inline-flex min-h-11 items-center gap-2 self-start rounded-sm text-sm text-text-secondary hover:text-text-primary"
    >
      <ArrowLeft size={16} aria-hidden />
      {t("back")}
    </Link>
  );
}

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgot");
  const tv = useTranslations("common.validation");
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
      notify(err instanceof Error ? err.message : t("failed"), "error");
    } finally {
      setBusy(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email.trim());
    if (!parsed.success) {
      setError(tv(parsed.error.issues[0].message as "emailInvalid"));
      return;
    }
    void send(parsed.data);
  };

  if (sentTo) {
    return (
      <AuthCardLayout
        eyebrow={t("sentEyebrow")}
        icon={<MailCheck size={24} aria-hidden />}
        title={t("sentTitle")}
      >
        <p className="text-15 leading-relaxed text-text-secondary">
          {t.rich("sentBody", {
            address: sentTo,
            email: (chunks) => (
              <span dir="ltr" className="font-medium text-text-primary">
                {chunks}
              </span>
            ),
          })}
        </p>
        <p className="text-sm text-text-secondary">
          {t.rich("resend", {
            button: (chunks) => (
              <button
                type="button"
                onClick={() => {
                  void send(sentTo);
                  notify(t("sentAgain"), "info");
                }}
                disabled={busy}
                className="rounded-xs text-gold-light hover:text-text-primary disabled:opacity-50"
              >
                {chunks}
              </button>
            ),
          })}
        </p>
        <BackToLogin />
      </AuthCardLayout>
    );
  }

  return (
    <AuthCardLayout eyebrow={t("eyebrow")} title={t("title")}>
      <form onSubmit={submit} noValidate className="flex flex-col gap-4.5">
        <p className="text-15 leading-relaxed text-text-secondary">
          {t("intro")}
        </p>
        <Input
          label={t("email")}
          type="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
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
          {t("submit")}
        </Button>
        <span className="self-center">
          <BackToLogin />
        </span>
      </form>
    </AuthCardLayout>
  );
}
