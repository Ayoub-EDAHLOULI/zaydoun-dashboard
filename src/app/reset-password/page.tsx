"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CircleCheck, LinkIcon } from "lucide-react";
import { z } from "zod";
import { Button, buttonClasses } from "@/components/ui";
import { AuthCardLayout, PasswordInput } from "@/components/Auth/AuthLayout";
import { authService } from "@/lib/api/services/auth.service";
import { useToast } from "@/contexts/ToastContext";
import { PASSWORD_HINT, passwordRule } from "@/validations/password";

const resetSchema = z
  .object({ password: passwordRule, confirmPassword: z.string().min(1, "Type it again.") })
  .refine((d) => d.password === d.confirmPassword, {
    message: "The passwords don't match.",
    path: ["confirmPassword"],
  });

type Errors = Partial<Record<"password" | "confirmPassword", string>>;

function ExpiredLink() {
  return (
    <AuthCardLayout
      eyebrow="Bad or expired link"
      icon={<LinkIcon size={24} aria-hidden />}
      tone="error"
      title="This link no longer works"
    >
      <p className="text-15 leading-relaxed text-text-secondary">
        Reset links expire after an hour and can only be used once. Ask for a fresh one and use it
        right away.
      </p>
      <Link href="/forgot-password" className={buttonClasses({ size: "lg", fullWidth: true })}>
        Send a new link
      </Link>
    </AuthCardLayout>
  );
}

function ResetForm() {
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
      for (const issue of parsed.error.issues) next[issue.path[0] as keyof Errors] ??= issue.message;
      setErrors(next);
      return;
    }
    setBusy(true);
    try {
      await authService.resetPassword(token!, parsed.data.password);
      setState("done");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Couldn't reset your password";
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
        eyebrow="Reset done"
        icon={<CircleCheck size={24} aria-hidden />}
        tone="success"
        title="Password updated"
      >
        <p className="text-15 leading-relaxed text-text-secondary">
          You&apos;re all set. Log in with your new password. For safety, you&apos;ve been signed
          out on your other devices.
        </p>
        <Link href="/login" className={buttonClasses({ size: "lg", fullWidth: true })}>
          Go to log in
        </Link>
      </AuthCardLayout>
    );
  }

  return (
    <AuthCardLayout eyebrow="Reset password" title="Choose a new password">
      <form onSubmit={submit} noValidate className="flex flex-col gap-4.5">
        <PasswordInput
          label="New password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((x) => ({ ...x, password: undefined }));
          }}
          error={errors.password}
          hint={PASSWORD_HINT}
          disabled={busy}
          autoFocus
        />
        <PasswordInput
          label="Confirm new password"
          autoComplete="new-password"
          placeholder="Type it again"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setErrors((x) => ({ ...x, confirmPassword: undefined }));
          }}
          error={errors.confirmPassword}
          disabled={busy}
        />
        <Button type="submit" size="lg" fullWidth loading={busy}>
          Save new password
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
