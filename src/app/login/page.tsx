"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

const loginSchema = z.object({
  email: z.email("Enter a full email address."),
  password: z.string().min(1, "Enter your password."),
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
        next[issue.path[0] as keyof Errors] ??= issue.message;
      setErrors(next);
      return;
    }

    setBusy(true);
    try {
      const user = await login(parsed.data);
      router.push(getDashboardPath(user.role));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Couldn't log you in.";
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
      <AuthHeading title="Welcome back" subtitle="Log in to your library." />

      {deactivated && (
        <Notice tone="warning" title="This account has been deactivated">
          An admin turned it off. If you think that&apos;s a mistake,{" "}
          <Link
            href="/contact"
            className="text-gold-light hover:text-text-primary"
          >
            contact us
          </Link>
          .
        </Notice>
      )}
      {formError && <Notice tone="error" title={formError} />}

      <Input
        label="Email"
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
          label="Password"
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
          Forgot password?
        </Link>
      </div>

      <Button type="submit" size="lg" fullWidth loading={busy} className="mt-1">
        Log in
      </Button>

      <p className="mt-2 border-t border-border pt-5 text-center text-15 text-text-secondary">
        New here?{" "}
        <Link
          href="/register"
          className="font-medium text-gold-light hover:text-text-primary"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <AuthSplitLayout
      headline={
        <>
          Your books are <em>where you left them.</em>
        </>
      }
      aside={
        <p className="text-base leading-relaxed text-text-secondary">
          Every conversation is saved, down to the last page Zaydoun cited.
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
