"use client";

import { useState } from "react";
import { X, Loader2, AlertTriangle } from "lucide-react";
import { AdminUserRow } from "@/types/users.types";

interface DeleteUserModalProps {
  isOpen: boolean;
  user: AdminUserRow | null;
  onClose: () => void;
  onConfirm: (userId: string) => Promise<void>;
}

function ModalInner({
  user,
  onClose,
  onConfirm,
}: Omit<DeleteUserModalProps, "isOpen"> & { user: AdminUserRow }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(user.id);
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
            Delete user
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

        <div className="px-6 py-5 space-y-4">
          {/* Warning icon + message */}
          <div className="flex gap-4">
            <div
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(224,92,92,0.1)" }}
            >
              <AlertTriangle className="w-5 h-5" style={{ color: "var(--z-error)" }} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium" style={{ color: "var(--z-text-primary)" }}>
                This action cannot be undone.
              </p>
              <p className="text-sm" style={{ color: "var(--z-text-muted)" }}>
                All data for{" "}
                <span style={{ color: "var(--z-gold)", fontWeight: 600 }}>
                  {user.name ?? user.email}
                </span>{" "}
                — books, conversations, and sessions — will be permanently deleted.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
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
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--z-error)",
                color: "#fff",
                minWidth: "8rem",
              }}
              onMouseEnter={(e) => {
                if (!isLoading)
                  e.currentTarget.style.backgroundColor = "#c94a4a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--z-error)";
              }}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete permanently"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DeleteUserModal({
  isOpen,
  user,
  ...props
}: DeleteUserModalProps) {
  if (!isOpen || !user) return null;
  return <ModalInner key={user.id} user={user} {...props} />;
}
