"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  MessageSquare,
  Pencil,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Globe,
} from "lucide-react";
import { z } from "zod";
import { usersService } from "@/lib/api/services/users.service";
import { authService } from "@/lib/api/services/auth.service";
import { UserProfile } from "@/types/users.types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import UserModal from "@/components/Dashboard/Users/UserModal";

const REPLY_LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "Arabic", flag: "🇸🇦" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "zh", label: "Chinese", flag: "🇨🇳" },
];

const REPLY_LANG_KEY = "zaydoun_reply_language";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof changePasswordSchema>;

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div
      className="rounded-xl p-5 flex items-center gap-4"
      style={{
        backgroundColor: "var(--z-bg-elevated)",
        border: "1px solid var(--z-border)",
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{
          backgroundColor: "var(--z-gold-muted)",
          border: "1px solid var(--z-border-gold)",
        }}
      >
        <Icon className="w-5 h-5" style={{ color: "var(--z-gold)" }} />
      </div>
      <div>
        <p
          className="text-2xl font-bold"
          style={{ color: "var(--z-text-primary)" }}
        >
          {value}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--z-text-muted)" }}>
          {label}
        </p>
      </div>
    </div>
  );
}

function ChangePasswordSection({
  accessToken,
}: {
  accessToken: string | null;
}) {
  const { notify } = useToast();
  const [form, setForm] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof PasswordFormData, string>>
  >({});
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const set =
    (field: keyof PasswordFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: undefined }));
    };

  const borderColor = (field: keyof PasswordFormData) =>
    errors[field] ? "var(--z-error)" : "var(--z-border)";

  const focusHandlers = (field: keyof PasswordFormData) => ({
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = errors[field]
        ? "var(--z-error)"
        : "var(--z-gold)";
      e.currentTarget.style.boxShadow = errors[field]
        ? "0 0 0 3px rgba(224,92,92,0.1)"
        : "0 0 0 3px rgba(201,168,76,0.1)";
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = borderColor(field);
      e.currentTarget.style.boxShadow = "none";
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = changePasswordSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof PasswordFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as keyof PasswordFormData] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!accessToken) return;
    setIsLoading(true);
    try {
      await authService.changePassword(
        {
          currentPassword: result.data.currentPassword,
          newPassword: result.data.newPassword,
        },
        accessToken,
      );
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      notify("Password changed successfully", "success");
    } catch (err: unknown) {
      notify(
        err instanceof Error ? err.message : "Failed to change password",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase =
    "w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all duration-150";

  const fields: {
    key: keyof PasswordFormData;
    label: string;
    showKey: keyof typeof show;
    placeholder: string;
  }[] = [
    {
      key: "currentPassword",
      label: "Current password",
      showKey: "current",
      placeholder: "Your current password",
    },
    {
      key: "newPassword",
      label: "New password",
      showKey: "new",
      placeholder: "Min. 8 characters",
    },
    {
      key: "confirmPassword",
      label: "Confirm new password",
      showKey: "confirm",
      placeholder: "Repeat new password",
    },
  ];

  return (
    <div
      className="rounded-xl p-6"
      style={{
        backgroundColor: "var(--z-bg-surface)",
        border: "1px solid var(--z-border)",
      }}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{
            backgroundColor: "var(--z-gold-muted)",
            border: "1px solid var(--z-border-gold)",
          }}
        >
          <Lock className="w-4 h-4" style={{ color: "var(--z-gold)" }} />
        </div>
        <div>
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--z-text-primary)" }}
          >
            Change password
          </h3>
          <p className="text-xs" style={{ color: "var(--z-text-muted)" }}>
            Update your password to keep your account secure
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ key, label, showKey, placeholder }) => (
          <div key={key}>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--z-text-secondary)" }}
            >
              {label}
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--z-text-muted)" }}
              />
              <input
                type={show[showKey] ? "text" : "password"}
                value={form[key]}
                onChange={set(key)}
                placeholder={placeholder}
                autoComplete={
                  key === "currentPassword"
                    ? "current-password"
                    : "new-password"
                }
                className={inputBase}
                style={{
                  backgroundColor: "var(--z-bg-elevated)",
                  border: `1.5px solid ${borderColor(key)}`,
                  color: "var(--z-text-primary)",
                }}
                {...focusHandlers(key)}
              />
              <button
                type="button"
                onClick={() =>
                  setShow((p) => ({ ...p, [showKey]: !p[showKey] }))
                }
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "var(--z-text-muted)" }}
              >
                {show[showKey] ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors[key] && (
              <p
                className="text-xs font-medium mt-1.5"
                style={{ color: "var(--z-error)" }}
              >
                {errors[key]}
              </p>
            )}
          </div>
        ))}

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--z-gold)",
              color: "#0d0d0d",
              minWidth: "9rem",
            }}
            onMouseEnter={(e) => {
              if (!isLoading)
                e.currentTarget.style.backgroundColor = "var(--z-gold-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--z-gold)";
            }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Update password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function UserProfilePage() {
  const { updateUser, accessToken } = useAuth();
  const { notify } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyLang, setReplyLang] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(REPLY_LANG_KEY) ?? "en";
    }
    return "en";
  });

  const handleReplyLang = (code: string) => {
    setReplyLang(code);
    localStorage.setItem(REPLY_LANG_KEY, code);
  };

  useEffect(() => {
    usersService
      .getMe()
      .then(setProfile)
      .catch((err: Error) => notify(err.message, "error"))
      .finally(() => setIsLoading(false));
  }, [notify]);

  const handleSave = async ({ name }: { name: string }) => {
    try {
      const updated = await usersService.updateMe({ name });
      setProfile((prev) =>
        prev ? { ...prev, ...updated, stats: prev.stats } : prev,
      );
      updateUser({
        id: updated.id,
        name: updated.name ?? "",
        email: updated.email,
        role: "USER",
      });
      notify("Profile updated", "success");
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : "Update failed", "error");
      throw err;
    }
  };

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div
          className="w-7 h-7 rounded-full border-2 animate-spin"
          style={{
            borderColor: "var(--z-gold)",
            borderTopColor: "transparent",
          }}
        />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <>
      <UserModal
        isOpen={isModalOpen}
        currentName={profile.name ?? ""}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <div className="space-y-6">
        {/* Top row: Profile card (left) + Language card (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile card */}
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: "var(--z-bg-surface)",
              border: "1px solid var(--z-border)",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                style={{
                  backgroundColor: "var(--z-gold-muted)",
                  color: "var(--z-gold)",
                  border: "2px solid var(--z-border-gold)",
                }}
              >
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <h2
                  className="text-lg font-semibold truncate"
                  style={{ color: "var(--z-text-primary)" }}
                >
                  {profile.name ?? profile.email}
                </h2>
                <p
                  className="text-sm truncate"
                  style={{ color: "var(--z-text-muted)" }}
                >
                  {profile.email}
                </p>
                {joinedDate && (
                  <div
                    className="flex items-center gap-1.5 mt-1.5"
                    style={{ color: "var(--z-text-muted)" }}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs">Joined {joinedDate}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: "var(--z-gold-muted)",
                  color: "var(--z-gold)",
                  border: "1px solid var(--z-border-gold)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(201,168,76,0.25)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--z-gold-muted)")
                }
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit profile
              </button>
            </div>
          </div>

          {/* Language card */}
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: "var(--z-bg-surface)",
              border: "1px solid var(--z-border)",
            }}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "var(--z-gold-muted)",
                  border: "1px solid var(--z-border-gold)",
                }}
              >
                <Globe className="w-4 h-4" style={{ color: "var(--z-gold)" }} />
              </div>
              <div>
                <h3
                  className="text-sm font-semibold"
                  style={{ color: "var(--z-text-primary)" }}
                >
                  AI Reply Language
                </h3>
                <p className="text-xs" style={{ color: "var(--z-text-muted)" }}>
                  Zaydoun will respond in this language
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {REPLY_LANGUAGES.map((lang) => {
                const active = lang.code === replyLang;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleReplyLang(lang.code)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                    style={{
                      backgroundColor: active
                        ? "var(--z-gold-muted)"
                        : "var(--z-bg-elevated)",
                      border: `1px solid ${active ? "var(--z-border-gold)" : "var(--z-border)"}`,
                      color: active ? "var(--z-gold)" : "var(--z-text-muted)",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.borderColor =
                          "var(--z-border-gold)";
                        e.currentTarget.style.color = "var(--z-gold)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.borderColor = "var(--z-border)";
                        e.currentTarget.style.color = "var(--z-text-muted)";
                      }
                    }}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={BookOpen}
            label="Books in library"
            value={profile.stats.totalBooks}
          />
          <StatCard
            icon={MessageSquare}
            label="Conversations"
            value={profile.stats.totalConversations}
          />
        </div>

        {/* Change password */}
        <ChangePasswordSection accessToken={accessToken} />
      </div>
    </>
  );
}
