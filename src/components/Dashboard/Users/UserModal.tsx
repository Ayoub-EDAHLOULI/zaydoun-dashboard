"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import {
  updateUserSchema,
  type UpdateUserFormData,
} from "@/validations/users.validations";

interface UserModalProps {
  isOpen: boolean;
  currentName: string;
  onClose: () => void;
  onSave: (data: UpdateUserFormData) => Promise<void>;
}

function ModalInner({
  currentName,
  onClose,
  onSave,
}: Omit<UserModalProps, "isOpen">) {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = updateUserSchema.safeParse({ name });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    try {
      await onSave({ name });
      onClose();
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
        className="w-full max-w-sm rounded-2xl overflow-hidden"
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
          <h2
            className="text-base font-semibold"
            style={{ color: "var(--z-text-primary)" }}
          >
            Edit profile
          </h2>
          <button
            onClick={onClose}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--z-text-secondary)" }}
            >
              Display name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="Your name"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all duration-150"
              style={{
                backgroundColor: "var(--z-bg-surface)",
                border: `1.5px solid ${error ? "var(--z-error)" : "var(--z-border)"}`,
                color: "var(--z-text-primary)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = error
                  ? "var(--z-error)"
                  : "var(--z-gold)";
                e.currentTarget.style.boxShadow = error
                  ? "0 0 0 3px rgba(224,92,92,0.1)"
                  : "0 0 0 3px rgba(201,168,76,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = error
                  ? "var(--z-error)"
                  : "var(--z-border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            {error && (
              <p
                className="text-xs mt-1.5 font-medium"
                style={{ color: "var(--z-error)" }}
              >
                {error}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
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
                minWidth: "6rem",
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
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UserModal({ isOpen, ...props }: UserModalProps) {
  if (!isOpen) return null;
  return <ModalInner key={props.currentName} {...props} />;
}
