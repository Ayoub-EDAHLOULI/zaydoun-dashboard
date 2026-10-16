"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CircleAlert, ShieldOff } from "lucide-react";
import { z } from "zod";
import { Button, Input } from "@/components/ui";
import {
  AuthHeading,
  AuthSplitLayout,
  PasswordInput,
} from "@/components/Auth/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/lib/routes";

// Messages are keys in common.json → "validation"
const loginSchema = z.object({
  email: z.email("emailInvalid"),
  password: z.string().min(1, "passwordRequired"),
});

type Errors = Partial<Record<"email" | "password", string>>;

function Notice({
  tone,
  title,
  children,
}: {
  tone: "error" | "warning";
  title: string;
  children?: React.ReactNode;
}) {
  const Icon = tone === "warning" ? ShieldOff : CircleAlert;
  return (
    <div
      role="alert"
      className="flex gap-3 rounded-[10px] border border-error/35 bg-error/8 px-4 py-3.5"
    >
      <Icon size={20} className="mt-0.5 shrink-0 text-error-text" aria-hidden />
      <span className="flex flex-col gap-1">
        <span className="text-sm font-semibold">{title}</span>
        {children && (
          <span className="text-sm leading-normal text-text-secondary">
            {children}
          </span>
        )}
      </span>
    </div>
  );
}

function LoginForm() {
  const t = useTranslations("auth.login");
  const tv = useTranslations("common.validation");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [deactivated, setDeactivated] = useState(
    searchParams.get("deactivated") === "1",
  );
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const parsed = loginSchema.safeParse({ email: email.trim(), password });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues)
        next[issue.path[0] as keyof Errors] ??= tv(issue.message as "required");
      setErrors(next);
      return;
    }

    setBusy(true);
    try {
      const user = await login(parsed.data);
      router.push(getDashboardPath(user.role));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("failed");
      if (/deactivated/i.test(message)) setDeactivated(true);
      else setFormError(message);
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-labelledby="auth-title"
      className="flex flex-col gap-4 sm:gap-5"
    >
      <AuthHeading title={t("title")} subtitle={t("subtitle")} />

      {deactivated && (
        <Notice tone="warning" title={t("deactivatedTitle")}>
          {t.rich("deactivatedBody", {
            link: (chunks) => (
              <Link
                href="/contact"
                className="text-gold-light hover:text-text-primary"
              >
                {chunks}
              </Link>
            ),
          })}
        </Notice>
      )}
      {formError && <Notice tone="error" title={formError} />}

      <Input
        label={t("email")}
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setErrors((x) => ({ ...x, email: undefined }));
        }}
        error={errors.email}
        disabled={busy}
        autoFocus
      />
      <div className="flex flex-col gap-2">
        <PasswordInput
          label={t("password")}
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((x) => ({ ...x, password: undefined }));
          }}
          error={errors.password}
          disabled={busy}
        />
        <Link
          href="/forgot-password"
          className="self-end rounded-xs text-13 text-gold-light hover:text-text-primary"
        >
          {t("forgot")}
        </Link>
      </div>

      <Button type="submit" size="lg" fullWidth loading={busy} className="mt-1">
        {t("submit")}
      </Button>

      <p className="mt-2 border-t border-border pt-5 text-center text-15 text-text-secondary">
        {t("newHere")}{" "}
        <Link
          href="/register"
          className="font-medium text-gold-light hover:text-text-primary"
        >
          {t("createAccount")}
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  const t = useTranslations("auth.login");
  return (
    <AuthSplitLayout
      headline={t.rich("headline", { em: (chunks) => <em>{chunks}</em> })}
      aside={
        <p className="text-base leading-relaxed text-text-secondary">
          {t("aside")}
        </p>
      }
    >
      {/* useSearchParams needs a Suspense boundary in the App Router */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthSplitLayout>
  );
}
