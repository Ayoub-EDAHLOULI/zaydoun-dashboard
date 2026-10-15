"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Check, Pencil } from "lucide-react";
import { z } from "zod";
import { Avatar, Button, ConfirmDialog, Input, Modal, Select, Skeleton } from "@/components/ui";
import { usersService } from "@/lib/api/services/users.service";
import { authService } from "@/lib/api/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { LANGUAGES } from "@/lib/languages";
import { REPLY_LANG_KEY, getReplyLanguagePref } from "@/lib/preferences";
import { cn } from "@/lib/cn";
import { PASSWORD_HINT, passwordRule } from "@/validations/password";
import type { UserProfile } from "@/types/users.types";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "The passwords don't match.",
    path: ["confirmPassword"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;
const EMPTY_PASSWORDS: PasswordForm = { currentPassword: "", newPassword: "", confirmPassword: "" };

function Card({
  title,
  description,
  danger = false,
  row = false,
  children,
}: {
  title?: string;
  description?: string;
  danger?: boolean;
  /** Content side by side (wraps on small screens) */
  row?: boolean;
  children: ReactNode;
}) {
  const id = title ? `card-${title.toLowerCase().replace(/\s+/g, "-")}` : undefined;
  return (
    <section
      aria-labelledby={id}
      className={cn(
        "flex rounded-lg border p-6 md:p-7",
        row ? "flex-row flex-wrap items-center justify-between gap-5" : "flex-col gap-4",
        danger ? "border-error/35" : "border-border bg-bg-surface",
      )}
    >
      {title && (
        <div className="flex flex-col gap-1">
          <h2 id={id} className="text-lg font-semibold">
            {title}
          </h2>
          {description && <p className="text-sm text-text-secondary">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

export default function ProfileView() {
  const { user, accessToken, updateUser, logout, isAdmin } = useAuth();
  const { notify } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [nameOpen, setNameOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [replyLang, setReplyLang] = useState<string>(getReplyLanguagePref);
  const [langSaved, setLangSaved] = useState(false);
  const [passwords, setPasswords] = useState<PasswordForm>(EMPTY_PASSWORDS);
  const [pwErrors, setPwErrors] = useState<Partial<Record<keyof PasswordForm, string>>>({});
  const [savingPw, setSavingPw] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    usersService
      .getMe()
      .then(setProfile)
      .catch((err: unknown) =>
        notify(err instanceof Error ? err.message : "Couldn't load your profile", "error"),
      );
  }, [notify]);

  // "Saved" fades after a moment
  useEffect(() => {
    if (!langSaved) return;
    const t = setTimeout(() => setLangSaved(false), 2500);
    return () => clearTimeout(t);
  }, [langSaved]);

  // ── Name ────────────────────────────────────────────────────────────────
  const saveName = async (e: FormEvent) => {
    e.preventDefault();
    const name = nameDraft.trim();
    if (!name) return;
    setSavingName(true);
    try {
      const updated = await usersService.updateMe({ name });
      // PATCH /users/me returns no stats — keep the ones already loaded
      setProfile((prev) => (prev ? { ...prev, ...updated, stats: prev.stats } : prev));
      // Merge into the session user so role/isActive are preserved
      if (user) updateUser({ ...user, name: updated.name ?? "" });
      notify("Name updated", "success");
      setNameOpen(false);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Couldn't update your name", "error");
    } finally {
      setSavingName(false);
    }
  };

  // ── Reply language (stored in this browser) ─────────────────────────────
  const changeReplyLang = (code: string) => {
    setReplyLang(code);
    try {
      localStorage.setItem(REPLY_LANG_KEY, code);
      setLangSaved(true);
    } catch {
      notify("Couldn't save this preference in your browser", "error");
    }
  };

  // ── Password ────────────────────────────────────────────────────────────
  const setPw = (field: keyof PasswordForm) => (value: string) => {
    setPasswords((p) => ({ ...p, [field]: value }));
    setPwErrors((e) => ({ ...e, [field]: undefined }));
  };

  const savePassword = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = passwordSchema.safeParse(passwords);
    if (!parsed.success) {
      const errors: typeof pwErrors = {};
      for (const issue of parsed.error.issues) {
        errors[issue.path[0] as keyof PasswordForm] ??= issue.message;
      }
      setPwErrors(errors);
      return;
    }
    if (!accessToken) return;
    setSavingPw(true);
    try {
      await authService.changePassword(
        { currentPassword: parsed.data.currentPassword, newPassword: parsed.data.newPassword },
        accessToken,
      );
      setPasswords(EMPTY_PASSWORDS);
      notify("Password updated", "success");
    } catch (err) {
      notify(err instanceof Error ? err.message : "Couldn't update your password", "error");
    } finally {
      setSavingPw(false);
    }
  };

  // ── Delete account ──────────────────────────────────────────────────────
  const deleteAccount = async () => {
    try {
      await usersService.deleteMe();
      notify("Your account was deleted", "success");
      await logout();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Couldn't delete your account", "error");
    }
  };

  const memberSince = profile
    ? new Date(profile.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : "";
  const books = profile?.stats.totalBooks ?? 0;
  const convs = profile?.stats.totalConversations ?? 0;
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
  const pwComplete =
    !!passwords.currentPassword && !!passwords.newPassword && !!passwords.confirmPassword;

  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col gap-6">
      <h1 className="font-serif text-32 leading-[1.1] font-normal tracking-[-0.02em] md:text-40">
        Profile
      </h1>

      {/* Account */}
      <section
        aria-label="Account"
        className="flex flex-wrap items-center gap-5 rounded-lg border border-border bg-bg-surface p-6 md:p-7"
      >
        <Avatar
          name={profile?.name ?? user?.name}
          email={profile?.email ?? user?.email}
          size={72}
          highlight
        />
        <div className="flex min-w-0 flex-[1_1_240px] flex-col gap-1">
          {profile ? (
            <>
              <span className="truncate text-xl font-semibold">{profile.name || "No name yet"}</span>
              <span className="truncate text-sm text-text-secondary">{profile.email}</span>
              <span className="text-13 text-text-secondary">
                Member since {memberSince} · {plural(books, "book")} · {plural(convs, "conversation")}
              </span>
            </>
          ) : (
            <>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
            </>
          )}
        </div>
        <Button
          variant="secondary"
          disabled={!profile}
          onClick={() => {
            setNameDraft(profile?.name ?? "");
            setNameOpen(true);
          }}
        >
          <Pencil size={16} aria-hidden />
          Edit name
        </Button>
      </section>

      {/* Reading preferences */}
      <Card title="Reading preferences" description="Used as the default for new conversations.">
        <div className="flex flex-wrap items-end gap-4">
          <Select
            label="Zaydoun replies in"
            value={replyLang}
            onChange={(e) => changeReplyLang(e.target.value)}
            wrapperClassName="w-full max-w-[280px]"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeName}
              </option>
            ))}
          </Select>
          <span
            role="status"
            className={cn(
              "flex h-11 items-center gap-1.5 text-13 text-success transition-opacity",
              langSaved ? "opacity-100" : "opacity-0",
            )}
          >
            <Check size={16} aria-hidden />
            {langSaved ? "Saved" : ""}
          </span>
        </div>
      </Card>

      {/* Password */}
      <Card title="Change password">
        <form onSubmit={savePassword} noValidate className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              label="Current password"
              type="password"
              autoComplete="current-password"
              value={passwords.currentPassword}
              onChange={(e) => setPw("currentPassword")(e.target.value)}
              error={pwErrors.currentPassword}
            />
            <Input
              label="New password"
              type="password"
              autoComplete="new-password"
              value={passwords.newPassword}
              onChange={(e) => setPw("newPassword")(e.target.value)}
              error={pwErrors.newPassword}
              hint={pwErrors.newPassword ? undefined : PASSWORD_HINT}
            />
            <Input
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              value={passwords.confirmPassword}
              onChange={(e) => setPw("confirmPassword")(e.target.value)}
              error={pwErrors.confirmPassword}
            />
          </div>
          <div>
            <Button type="submit" loading={savingPw} disabled={!pwComplete}>
              Update password
            </Button>
          </div>
        </form>
      </Card>

      {/* Danger zone — readers only; admins are managed from Users */}
      {!isAdmin && (
        <Card danger row>
          <div className="flex flex-[1_1_320px] flex-col gap-1">
            <h2 className="text-lg font-semibold">Delete account</h2>
            <p className="text-sm text-text-secondary">
              Removes your books, every conversation and your account. This can&apos;t be undone.
            </p>
          </div>
          <Button variant="destructive-outline" onClick={() => setDeleteOpen(true)} disabled={!profile}>
            Delete my account
          </Button>
        </Card>
      )}

      <Modal
        open={nameOpen}
        onClose={() => setNameOpen(false)}
        title="Edit name"
        size="sm"
        dismissible={!savingName}
      >
        <form onSubmit={saveName} className="flex flex-col gap-5">
          <Input
            label="Full name"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            autoComplete="name"
            data-autofocus
          />
          <div className="flex flex-col-reverse gap-2.5 md:flex-row md:justify-end">
            <Button variant="ghost" onClick={() => setNameOpen(false)} disabled={savingName}>
              Cancel
            </Button>
            <Button type="submit" loading={savingName} disabled={!nameDraft.trim()}>
              Save
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={deleteAccount}
        title="Delete your account?"
        description={`Your ${plural(books, "book")} and ${plural(convs, "conversation")} will be gone for good.`}
        confirmLabel="Delete forever"
        cancelLabel="Keep my account"
        requireText="DELETE"
      />
    </div>
  );
}
