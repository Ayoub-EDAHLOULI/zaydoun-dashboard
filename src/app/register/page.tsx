"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button, Input } from "@/components/ui";
import { AuthHeading, AuthSplitLayout, PasswordInput } from "@/components/Auth/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { authService } from "@/lib/api/services/auth.service";
import { getDashboardPath } from "@/lib/routes";
import { PASSWORD_HINT, passwordRule } from "@/validations/password";

const registerSchema = z
  .object({
    name: z.string().min(2, "Use at least 2 characters."),
    email: z.email("Enter a full email address."),
    password: passwordRule,
    confirmPassword: z.string().min(1, "Type your password again."),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "The passwords don't match.",
    path: ["confirmPassword"],
  });

type Form = z.infer<typeof registerSchema>;
type Errors = Partial<Record<keyof Form, string>>;

const STEPS = ["Upload a PDF", "Zaydoun reads it, page by page", "Ask your first question"];

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { notify } = useToast();

  const [form, setForm] = useState<Form>({ name: "", email: "", password: "", confirmPassword: "" });
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
      for (const issue of parsed.error.issues) next[issue.path[0] as keyof Form] ??= issue.message;
      setErrors(next);
      return;
    }

    setBusy(true);
    try {
      const { name, email, password } = parsed.data;
      await authService.register({ name, email, password });
      const user = await login({ email, password });
      notify(`Welcome, ${name.split(" ")[0]}! Your shelf is ready.`, "success");
      router.push(getDashboardPath(user.role));
    } catch (err) {
      notify(err instanceof Error ? err.message : "Couldn't create your account", "error");
      setBusy(false);
    }
  };

  return (
    <AuthSplitLayout
      headline={
        <>
          Bring a book. <em>He&apos;s already curious.</em>
        </>
      }
      aside={
        <ol className="flex flex-col gap-3">
          {STEPS.map((step, i) => (
            <li key={step} className="flex items-center gap-3 text-15 text-text-secondary">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border-gold font-serif text-sm text-gold-light">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      }
    >
      <form onSubmit={submit} noValidate aria-labelledby="auth-title" className="flex flex-col gap-5">
        <AuthHeading title="Create your account" subtitle="Free to start. No card needed." />

        <Input
          label="Full name"
          autoComplete="name"
          value={form.name}
          onChange={(e) => set("name")(e.target.value)}
          error={errors.name}
          disabled={busy}
          autoFocus
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => set("email")(e.target.value)}
          error={errors.email}
          disabled={busy}
        />
        <PasswordInput
          label="Password"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => set("password")(e.target.value)}
          error={errors.password}
          hint={PASSWORD_HINT}
          disabled={busy}
        />
        <PasswordInput
          label="Confirm password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) => set("confirmPassword")(e.target.value)}
          error={errors.confirmPassword}
          disabled={busy}
        />

        <Button type="submit" size="lg" fullWidth loading={busy} className="mt-1">
          Create account
        </Button>

        <p className="mt-1 border-t border-border pt-4.5 text-center text-15 text-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-gold-light hover:text-text-primary">
            Log in
          </Link>
        </p>
      </form>
    </AuthSplitLayout>
  );
}
