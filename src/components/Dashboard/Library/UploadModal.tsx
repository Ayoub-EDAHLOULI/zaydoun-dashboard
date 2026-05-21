"use client";

import { useState, useRef } from "react";
import { X, Loader2, UploadCloud, FileText } from "lucide-react";
import {
  uploadBookSchema,
  type UploadBookFormData,
} from "@/validations/books.validations";
import { CreateBookDto } from "@/types/books.types";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, data: CreateBookDto) => Promise<void>;
}

const LANGUAGES = [
  { code: "ar", label: "Arabic" },
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "de", label: "German" },
];

function ModalInner({ onClose, onUpload }: Omit<UploadModalProps, "isOpen">) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState<UploadBookFormData>({
    title: "",
    author: "",
    language: "ar",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof UploadBookFormData | "file", string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (f: File | null) => {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setErrors((p) => ({ ...p, file: "Only PDF files are allowed" }));
      return;
    }
    setFile(f);
    setErrors((p) => ({ ...p, file: undefined }));
    if (!form.title) {
      const name = f.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
      setForm((p) => ({ ...p, title: name }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0] ?? null);
  };

  const set =
    (field: keyof UploadBookFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: undefined }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!file) newErrors.file = "Please select a PDF file";

    const result = uploadBookSchema.safeParse(form);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof UploadBookFormData;
        newErrors[key] = issue.message;
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await onUpload(file!, {
        title: form.title,
        author: form.author || undefined,
        language: form.language,
      });
      onClose();
    } catch {
      // error handled by caller
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all duration-150";

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    backgroundColor: "var(--z-bg-surface)",
    border: `1.5px solid ${hasError ? "var(--z-error)" : "var(--z-border)"}`,
    color: "var(--z-text-primary)",
  });

  const focusHandlers = (field: keyof UploadBookFormData) => ({
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = errors[field]
        ? "var(--z-error)"
        : "var(--z-gold)";
      e.currentTarget.style.boxShadow = errors[field]
        ? "0 0 0 3px rgba(224,92,92,0.1)"
        : "0 0 0 3px rgba(201,168,76,0.1)";
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = errors[field]
        ? "var(--z-error)"
        : "var(--z-border)";
      e.currentTarget.style.boxShadow = "none";
    },
  });

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
              Upload book
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--z-text-muted)" }}
            >
              PDF only · max 50 MB
            </p>
          </div>
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

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Drop zone */}
          <div
            className="relative flex flex-col items-center justify-center gap-2 rounded-xl p-6 cursor-pointer transition-all duration-150"
            style={{
              border: `2px dashed ${isDragging ? "var(--z-gold)" : errors.file ? "var(--z-error)" : "var(--z-border)"}`,
              backgroundColor: isDragging
                ? "var(--z-gold-muted)"
                : "var(--z-bg-surface)",
            }}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
            {file ? (
              <>
                <FileText
                  className="w-8 h-8"
                  style={{ color: "var(--z-gold)" }}
                />
                <p
                  className="text-sm font-medium text-center"
                  style={{ color: "var(--z-text-primary)" }}
                >
                  {file.name}
                </p>
                <p className="text-xs" style={{ color: "var(--z-text-muted)" }}>
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </>
            ) : (
              <>
                <UploadCloud
                  className="w-8 h-8"
                  style={{ color: "var(--z-text-muted)" }}
                />
                <p
                  className="text-sm"
                  style={{ color: "var(--z-text-secondary)" }}
                >
                  Drop PDF here or{" "}
                  <span style={{ color: "var(--z-gold)" }}>browse</span>
                </p>
              </>
            )}
          </div>
          {errors.file && (
            <p
              className="text-xs font-medium -mt-2"
              style={{ color: "var(--z-error)" }}
            >
              {errors.file}
            </p>
          )}

          {/* Title */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--z-text-secondary)" }}
            >
              Title <span style={{ color: "var(--z-error)" }}>*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={set("title")}
              placeholder="Book title"
              className={inputClass}
              style={inputStyle(!!errors.title)}
              {...focusHandlers("title")}
            />
            {errors.title && (
              <p
                className="text-xs mt-1 font-medium"
                style={{ color: "var(--z-error)" }}
              >
                {errors.title}
              </p>
            )}
          </div>

          {/* Author + Language row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--z-text-secondary)" }}
              >
                Author
              </label>
              <input
                type="text"
                value={form.author ?? ""}
                onChange={set("author")}
                placeholder="Optional"
                className={inputClass}
                style={inputStyle(false)}
                {...focusHandlers("author")}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--z-text-secondary)" }}
              >
                Language
              </label>
              <select
                value={form.language}
                onChange={set("language")}
                className={inputClass}
                style={{ ...inputStyle(!!errors.language), cursor: "pointer" }}
                {...focusHandlers("language")}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
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
              ) : (
                "Upload"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UploadModal({ isOpen, ...props }: UploadModalProps) {
  if (!isOpen) return null;
  return <ModalInner {...props} />;
}
