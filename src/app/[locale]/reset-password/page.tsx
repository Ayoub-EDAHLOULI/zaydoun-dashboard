"use client";

import { Link } from "@/i18n/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CircleCheck, LinkIcon } from "lucide-react";
import { z } from "zod";
import { Button, buttonClasses } from "@/components/ui";
import { AuthCardLayout, PasswordInput } from "@/components/Auth/AuthLayout";
import { authService } from "@/lib/api/services/auth.service";
import { useToast } from "@/contexts/ToastContext";
import { passwordRule } from "@/validations/password";

// Messages are keys in common.json → "validation"
const resetSchema = z
  .object({ password: passwordRule, confirmPassword: z.string().min(1, "retypePassword") })
  .refine((d) => d.password === d.confirmPassword, {
    message: "passwordsMismatch",
    path: ["confirmPassword"],
  });

type Errors = Partial<Record<"password" | "confirmPassword", string>>;

function ExpiredLink() {
  const t = useTranslations("auth.reset");
  return (
    <AuthCardLayout
      eyebrow={t("expiredEyebrow")}
      icon={<LinkIcon size={24} aria-hidden />}
      tone="error"
      title={t("expiredTitle")}
    >
      <p className="text-15 leading-relaxed text-text-secondary">{t("expiredBody")}</p>
      <Link href="/forgot-password" className={buttonClasses({ size: "lg", fullWidth: true })}>
        {t("newLink")}
      </Link>
    </AuthCardLayout>
  );
}

function ResetForm() {
  const t = useTranslations("auth.reset");
  const tv = useTranslations("common.validation");
  const token = useSearchParams().get("token");
  const { notify } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<"form" | "done" | "expired">(token ? "form" : "expired");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = resetSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues)
        next[issue.path[0] as keyof Errors] ??= tv(issue.message as "required");
      setErrors(next);
      return;
    }
    setBusy(true);
    try {
      await authService.resetPassword(token!, parsed.data.password);
      setState("done");
    } catch (err) {
      const message = err instanceof Error ? err.message : t("failed");
      // The API says "Reset link is invalid or has expired"
      if (/invalid|expired/i.test(message)) setState("expired");
      else notify(message, "error");
    } finally {
      setBusy(false);
    }
  };

  if (state === "expired") return <ExpiredLink />;

  if (state === "done") {
    return (
      <AuthCardLayout
        eyebrow={t("doneEyebrow")}
        icon={<CircleCheck size={24} aria-hidden />}
        tone="success"
        title={t("doneTitle")}
      >
        <p className="text-15 leading-relaxed text-text-secondary">{t("doneBody")}</p>
        <Link href="/login" className={buttonClasses({ size: "lg", fullWidth: true })}>
          {t("goToLogin")}
        </Link>
      </AuthCardLayout>
    );
  }

  return (
    <AuthCardLayout eyebrow={t("eyebrow")} title={t("title")}>
      <form onSubmit={submit} noValidate className="flex flex-col gap-4.5">
        <PasswordInput
          label={t("newPassword")}
          autoComplete="new-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((x) => ({ ...x, password: undefined }));
          }}
          error={errors.password}
          hint={tv("passwordHint")}
          disabled={busy}
          autoFocus
        />
        <PasswordInput
          label={t("confirmPassword")}
          autoComplete="new-password"
          placeholder={t("confirmPlaceholder")}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setErrors((x) => ({ ...x, confirmPassword: undefined }));
          }}
          error={errors.confirmPassword}
          disabled={busy}
        />
        <Button type="submit" size="lg" fullWidth loading={busy}>
          {t("submit")}
        </Button>
      </form>
    </AuthCardLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    // useSearchParams needs a Suspense boundary in the App Router
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
