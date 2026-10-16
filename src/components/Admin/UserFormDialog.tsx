"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { Button, Input, Modal } from "@/components/ui";
import {
  createAdminUserSchema,
  editAdminUserSchema,
  type CreateAdminUserFormData,
  type EditAdminUserFormData,
} from "@/validations/users.validations";
import { cn } from "@/lib/cn";
import type { AdminUserRow } from "@/types/users.types";

type Mode =
  | { kind: "create"; onSubmit: (data: CreateAdminUserFormData) => Promise<void> }
  | { kind: "edit"; user: AdminUserRow; onSubmit: (data: EditAdminUserFormData) => Promise<void> };

// Text: admin.json → users.form.roles.<key>
const ROLES = [
  { value: "USER", key: "reader" },
  { value: "ADMIN", key: "admin" },
] as const;

// "Add a user" and "Edit details" — one form, two modes
export function UserFormDialog({
  open,
  onClose,
  mode,
}: {
  open: boolean;
  onClose: () => void;
  mode: Mode | null;
}) {
  const t = useTranslations("admin.users.form");
  const [busy, setBusy] = useState(false);
  // New key each time it opens, so the form starts fresh
  const [wasOpen, setWasOpen] = useState(open);
  const [session, setSession] = useState(0);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setSession((s) => s + 1);
  }

  const creating = mode?.kind === "create";
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={creating ? t("addTitle") : t("editTitle")}
      description={creating ? t("addDescription") : t("editDescription")}
      dismissible={!busy}
    >
      {mode && (
        <UserForm key={session} mode={mode} onDone={onClose} onBusyChange={setBusy} />
      )}
    </Modal>
  );
}

function UserForm({
  mode,
  onDone,
  onBusyChange,
}: {
  mode: Mode;
  onDone: () => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const t = useTranslations("admin.users.form");
  const tv = useTranslations("common.validation");
  const tc = useTranslations("common");
  const editing = mode.kind === "edit" ? mode.user : null;
  const [name, setName] = useState(editing?.name ?? "");
  const [email, setEmail] = useState(editing?.email ?? "");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed =
      mode.kind === "create"
        ? createAdminUserSchema.safeParse({ name: name.trim(), email: email.trim(), role })
        : editAdminUserSchema.safeParse({ name: name.trim(), email: email.trim() });
    if (!parsed.success) {
      const next: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as "name" | "email";
        next[key] ??= key === "email" ? tv("emailInvalid") : tv("nameMin");
      }
      setErrors(next);
      return;
    }

    setBusy(true);
    onBusyChange(true);
    try {
      if (mode.kind === "create") await mode.onSubmit(parsed.data as CreateAdminUserFormData);
      else await mode.onSubmit(parsed.data as EditAdminUserFormData);
      onDone();
    } catch {
      // The caller shows the error toast; keep the form open
    } finally {
      setBusy(false);
      onBusyChange(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <Input
        label={t("name")}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setErrors((x) => ({ ...x, name: undefined }));
        }}
        error={errors.name}
        autoComplete="off"
        disabled={busy}
        data-autofocus
      />
      <Input
        label={t("email")}
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setErrors((x) => ({ ...x, email: undefined }));
        }}
        error={errors.email}
        autoComplete="off"
        disabled={busy}
      />

      {mode.kind === "create" && (
        <fieldset className="flex flex-col gap-2.5">
          <legend className="mb-2.5 text-13 font-medium text-text-secondary">
            {t("role")}
          </legend>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {ROLES.map((r) => {
              const selected = role === r.value;
              return (
                <label
                  key={r.value}
                  className={cn(
                    "flex cursor-pointer gap-3 rounded-md border p-3.5 transition-colors",
                    selected
                      ? "border-gold bg-gold/12"
                      : "border-border bg-bg-elevated hover:border-border-strong",
                    "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold",
                  )}
                >
                  <input
                    type="radio"
                    name="user-role"
                    value={r.value}
                    checked={selected}
                    disabled={busy}
                    onChange={() => setRole(r.value)}
                    className="mt-0.5 size-[18px] shrink-0 accent-gold focus-visible:outline-none"
                  />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-15 font-medium">{t(`roles.${r.key}.label`)}</span>
                    <span className="text-13 leading-snug text-text-secondary">
                      {t(`roles.${r.key}.detail`)}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="flex flex-col-reverse gap-2.5 border-t border-border pt-4 md:flex-row md:justify-end">
        <Button variant="ghost" onClick={onDone} disabled={busy}>
          {tc("cancel")}
        </Button>
        <Button type="submit" loading={busy}>
          {mode.kind === "create" ? (
            <>
              {!busy && <Send size={16} aria-hidden />}
              {t("submitAdd")}
            </>
          ) : (
            t("submitEdit")
          )}
        </Button>
      </div>
    </form>
  );
}
