"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Button, Input } from "@/components/ui";
import {
  AuthHeading,
  AuthSplitLayout,
  PasswordInput,
} from "@/components/Auth/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { authService } from "@/lib/api/services/auth.service";
import { getDashboardPath } from "@/lib/routes";
import { passwordRule } from "@/validations/password";

// Messages are keys in common.json → "validation"
const registerSchema = z
  .object({
    name: z.string().min(2, "nameMin"),
    email: z.email("emailInvalid"),
    password: passwordRule,
    confirmPassword: z.string().min(1, "retypePassword"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "passwordsMismatch",
    path: ["confirmPassword"],
  });

type Form = z.infer<typeof registerSchema>;
type Errors = Partial<Record<keyof Form, string>>;

const STEPS = ["step1", "step2", "step3"] as const;

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const tv = useTranslations("common.validation");
  const router = useRouter();
  const { login } = useAuth();
  const { notify } = useToast();

  const [form, setForm] = useState<Form>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  const set = (field: keyof Form) => (value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = registerSchema.safeParse({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
    });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues)
        next[issue.path[0] as keyof Form] ??= tv(issue.message as "required");
      setErrors(next);
      return;
    }

    setBusy(true);
    try {
      const { name, email, password } = parsed.data;
      await authService.register({ name, email, password });
      const user = await login({ email, password });
      notify(t("welcome", { name: name.split(" ")[0] }), "success");
      router.push(getDashboardPath(user.role));
    } catch (err) {
      notify(
        err instanceof Error ? err.message : t("failed"),
        "error",
      );
      setBusy(false);
    }
  };

  return (
    <AuthSplitLayout
      headline={t.rich("headline", { em: (chunks) => <em>{chunks}</em> })}
      aside={
        <ol className="flex flex-col gap-3">
          {STEPS.map((step, i) => (
            <li
              key={step}
              className="flex items-center gap-3 text-15 text-text-secondary"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border-gold font-serif text-sm text-gold-light">
                {i + 1}
              </span>
              {t(step)}
            </li>
          ))}
        </ol>
      }
    >
      <form
        onSubmit={submit}
        noValidate
        aria-labelledby="auth-title"
        className="flex flex-col gap-4 sm:gap-5"
      >
        <AuthHeading title={t("title")} subtitle={t("subtitle")} />

        <Input
          label={t("name")}
          autoComplete="name"
          value={form.name}
          onChange={(e) => set("name")(e.target.value)}
          error={errors.name}
          disabled={busy}
          autoFocus
        />
        <Input
          label={t("email")}
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => set("email")(e.target.value)}
          error={errors.email}
          disabled={busy}
        />
        <PasswordInput
          label={t("password")}
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => set("password")(e.target.value)}
          error={errors.password}
          hint={tv("passwordHint")}
          disabled={busy}
        />
        <PasswordInput
          label={t("confirmPassword")}
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) => set("confirmPassword")(e.target.value)}
          error={errors.confirmPassword}
          disabled={busy}
        />

        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={busy}
          className="mt-1"
        >
          {t("submit")}
        </Button>

        <p className="mt-1 border-t border-border pt-4.5 text-center text-15 text-text-secondary">
          {t("haveAccount")}{" "}
          <Link
            href="/login"
            className="font-medium text-gold-light hover:text-text-primary"
          >
            {t("logIn")}
          </Link>
        </p>
      </form>
    </AuthSplitLayout>
  );
}
