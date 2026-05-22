"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import {
  createAdminUserSchema,
  editAdminUserSchema,
  type CreateAdminUserFormData,
  type EditAdminUserFormData,
} from "@/validations/users.validations";
import { AdminUserRow } from "@/types/users.types";

type CreateMode = {
  mode: "create";
  user?: undefined;
  onSave: (data: CreateAdminUserFormData) => Promise<void>;
};

type EditMode = {
  mode: "edit";
  user: AdminUserRow;
  onSave: (data: EditAdminUserFormData) => Promise<void>;
};

type AdminUserModalProps = (CreateMode | EditMode) & {
  isOpen: boolean;
  onClose: () => void;
};

const inputClass =
  "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all duration-150";

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  backgroundColor: "var(--z-bg-surface)",
  border: `1.5px solid ${hasError ? "var(--z-error)" : "var(--z-border)"}`,
  color: "var(--z-text-primary)",
});

function focusHandlers(hasError: boolean) {
  return {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = hasError
        ? "var(--z-error)"
        : "var(--z-gold)";
      e.currentTarget.style.boxShadow = hasError
        ? "0 0 0 3px rgba(224,92,92,0.1)"
        : "0 0 0 3px rgba(201,168,76,0.1)";
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = hasError
        ? "var(--z-error)"
        : "var(--z-border)";
      e.currentTarget.style.boxShadow = "none";
    },
  };
}

function ModalInner(props: Omit<AdminUserModalProps, "isOpen">) {
  const isCreate = props.mode === "create";

  const [form, setForm] = useState({
    name: isCreate ? "" : (props.user.name ?? ""),
    email: isCreate ? "" : props.user.email,
    password: "",
    role: isCreate ? "USER" : props.user.role,
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const set =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: undefined }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let parseResult;
    if (isCreate) {
      parseResult = createAdminUserSchema.safeParse({
        name: form.name || undefined,
        email: form.email,
        password: form.password,
        role: form.role,
      });
    } else {
      parseResult = editAdminUserSchema.safeParse({
        name: form.name || undefined,
        email: form.email,
      });
    }

    if (!parseResult.success) {
      const newErrors: Record<string, string> = {};
      parseResult.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        newErrors[key] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      if (isCreate) {
        await (props as CreateMode).onSave(
          parseResult.data as CreateAdminUserFormData,
        );
      } else {
        await (props as EditMode).onSave(
          parseResult.data as EditAdminUserFormData,
        );
      }
      props.onClose();
    } catch {
      // error handled by caller
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "var(--z-bg-elevated)",
          border: "1px solid var(--z-border)",
          boxShadow: "var(--z-shadow-lg)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--z-border)" }}
        >
          <div>
            <h2
              className="text-base font-semibold"
              style={{ color: "var(--z-text-primary)" }}
            >
              {isCreate ? "Create user" : "Edit user"}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--z-text-muted)" }}>
              {isCreate
                ? "Add a new user to the platform"
                : `Editing ${props.user.name ?? props.user.email}`}
            </p>
          </div>
          <button
            onClick={props.onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: "var(--z-text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--z-bg-overlay)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name + Email row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--z-text-secondary)" }}
              >
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={set("name")}
                placeholder="Optional"
                className={inputClass}
                style={inputStyle(!!errors.name)}
                {...focusHandlers(!!errors.name)}
              />
              {errors.name && (
                <p className="text-xs mt-1 font-medium" style={{ color: "var(--z-error)" }}>
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--z-text-secondary)" }}
              >
                Email <span style={{ color: "var(--z-error)" }}>*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="user@example.com"
                className={inputClass}
                style={inputStyle(!!errors.email)}
                {...focusHandlers(!!errors.email)}
              />
              {errors.email && (
                <p className="text-xs mt-1 font-medium" style={{ color: "var(--z-error)" }}>
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Password (create only) */}
          {isCreate && (
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--z-text-secondary)" }}
              >
                Password <span style={{ color: "var(--z-error)" }}>*</span>
              </label>
              <input
                type="password"
                value={form.password}
                onChange={set("password")}
                placeholder="Min 8 characters"
                className={inputClass}
                style={inputStyle(!!errors.password)}
                {...focusHandlers(!!errors.password)}
              />
              {errors.password && (
                <p className="text-xs mt-1 font-medium" style={{ color: "var(--z-error)" }}>
                  {errors.password}
                </p>
              )}
            </div>
          )}

          {/* Role */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--z-text-secondary)" }}
            >
              Role
            </label>
            <select
              value={form.role}
              onChange={set("role")}
              className={inputClass}
              style={{ ...inputStyle(false), cursor: "pointer" }}
              {...focusHandlers(false)}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={props.onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{
                backgroundColor: "var(--z-bg-overlay)",
                color: "var(--z-text-secondary)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--z-border)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--z-bg-overlay)")
              }
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--z-gold)",
                color: "#0d0d0d",
                minWidth: "7rem",
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
              ) : isCreate ? (
                "Create"
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminUserModal({
  isOpen,
  ...props
}: AdminUserModalProps) {
  if (!isOpen) return null;
  return (
    <ModalInner
      key={props.mode === "edit" ? props.user.id : "create"}
      {...props}
    />
  );
}
