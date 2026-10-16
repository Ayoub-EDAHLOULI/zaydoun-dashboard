"use client";

import { useId, useRef, useState, type DragEvent } from "react";
import { useTranslations } from "next-intl";
import { FileText, Upload } from "lucide-react";
import { cn } from "@/lib/cn";

interface FileDropZoneProps {
  /** The currently chosen file, if any */
  file: File | null;
  onFileSelect: (file: File) => void;
  /** MIME type to accept — the API only takes PDFs */
  accept?: string;
  maxSizeMB?: number;
  /** External error (e.g. from form validation) */
  error?: string;
  disabled?: boolean;
  className?: string;
}

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function FileDropZone({
  file,
  onFileSelect,
  accept = "application/pdf",
  maxSizeMB = 50,
  error,
  disabled = false,
  className,
}: FileDropZoneProps) {
  const t = useTranslations("common.upload");
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const accepts = (f: File) => {
    if (accept && f.type !== accept) {
      setLocalError(t("onlyPdf"));
      return false;
    }
    if (f.size > maxSizeMB * 1024 * 1024) {
      setLocalError(t("tooBig", { size: maxSizeMB }));
      return false;
    }
    setLocalError(null);
    return true;
  };

  const pick = (f: File | undefined) => {
    if (f && accepts(f)) onFileSelect(f);
  };

  const onDragOver = (e: DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDrop = (e: DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragOver(false);
    pick(e.dataTransfer.files?.[0]);
  };

  const shownError = localError ?? error;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={inputId}
        onDragOver={onDragOver}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2.5 rounded-md border-[1.5px] border-dashed p-8 text-center transition-colors",
          "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold",
          disabled
            ? "cursor-not-allowed border-border-subtle bg-bg-surface opacity-60"
            : "cursor-pointer",
          !disabled &&
            (isDragOver
              ? "border-gold bg-gold/8"
              : shownError
                ? "border-error bg-bg-surface"
                : "border-border-strong bg-bg-surface hover:border-text-muted"),
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          disabled={disabled}
          className="sr-only"
          aria-invalid={!!shownError || undefined}
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = ""; // allow re-picking the same file
          }}
        />

        <span
          className={cn(
            "flex size-11 items-center justify-center rounded-md",
            isDragOver || file
              ? "bg-gold-muted text-gold-light"
              : "bg-bg-elevated text-text-secondary",
          )}
        >
          {isDragOver || file ? (
            <FileText size={20} aria-hidden />
          ) : (
            <Upload size={20} aria-hidden />
          )}
        </span>

        {isDragOver ? (
          // Browsers don't expose the file name until the drop
          <span className="text-15 font-medium text-gold-light">
            {t("release")}
          </span>
        ) : file ? (
          <>
            <span className="max-w-full truncate text-15 font-medium text-text-primary">
              {file.name}
            </span>
            <span className="text-13 text-text-secondary">
              {formatSize(file.size)} ·{" "}
              <span className="text-gold-light">{t("another")}</span>
            </span>
          </>
        ) : (
          <>
            <span className="text-15 font-medium text-text-primary">
              {t.rich("drop", {
                browse: (chunks) => (
                  <span className="text-gold-light">{chunks}</span>
                ),
              })}
            </span>
            <span className="text-13 text-text-secondary">
              {t("limit", { size: maxSizeMB })}
            </span>
          </>
        )}
      </label>
      {shownError && (
        <span role="alert" className="text-xs text-error">
          {shownError}
        </span>
      )}
    </div>
  );
}
