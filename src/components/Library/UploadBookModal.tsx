"use client";

import { useState, type FormEvent } from "react";
import { Upload } from "lucide-react";
import { Button, FileDropZone, Input, Modal, Select } from "@/components/ui";
import { uploadBookSchema } from "@/validations/books.validations";
import { LANGUAGES } from "@/lib/languages";
import type { CreateBookDto } from "@/types/books.types";

type FieldErrors = Partial<Record<"file" | "title" | "author" | "language", string>>;

interface UploadBookModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File, data: CreateBookDto) => Promise<void>;
  /** Shown above the button, e.g. "This uses your last free slot." */
  note?: string;
}

// "Add a book" — a dialog on desktop, a bottom sheet on mobile.
// The form lives in its own component so it resets every time it opens.
export function UploadBookModal({ open, onClose, onUpload, note }: UploadBookModalProps) {
  const [busy, setBusy] = useState(false);
  // New key each time it opens, so the form starts fresh (and stays mounted
  // while the dialog animates out)
  const [wasOpen, setWasOpen] = useState(open);
  const [session, setSession] = useState(0);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setSession((s) => s + 1);
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add a book"
      description="Zaydoun reads it page by page, so he can cite where every answer comes from."
      dismissible={!busy}
    >
      <UploadForm
        key={session}
        onUpload={onUpload}
        onDone={onClose}
        note={note}
        onBusyChange={setBusy}
      />
    </Modal>
  );
}

function UploadForm({
  onUpload,
  onDone,
  note,
  onBusyChange,
}: {
  onUpload: UploadBookModalProps["onUpload"];
  onDone: () => void;
  note?: string;
  onBusyChange: (busy: boolean) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [language, setLanguage] = useState("ar");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);

  const pickFile = (f: File) => {
    setFile(f);
    setErrors((e) => ({ ...e, file: undefined }));
    // Suggest a title from the file name if none was typed yet
    if (!title.trim()) {
      setTitle(f.name.replace(/\.pdf$/i, "").replace(/[-_]+/g, " ").trim());
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: FieldErrors = {};
    if (!file) next.file = "Choose a PDF to upload.";
    const parsed = uploadBookSchema.safeParse({ title, author, language });
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        next[issue.path[0] as keyof FieldErrors] = issue.message;
      }
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setBusy(true);
    onBusyChange(true);
    try {
      await onUpload(file!, {
        title: title.trim(),
        author: author.trim() || undefined,
        language,
      });
      onDone();
    } catch {
      // The caller already showed a toast — keep the form so the user can retry
    } finally {
      setBusy(false);
      onBusyChange(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <FileDropZone file={file} onFileSelect={pickFile} error={errors.file} disabled={busy} />

      <Input
        label="Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setErrors((x) => ({ ...x, title: undefined }));
        }}
        error={errors.title}
        disabled={busy}
        dir="auto"
        required
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label={
            <>
              Author <span className="font-normal text-text-secondary">(optional)</span>
            </>
          }
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          error={errors.author}
          disabled={busy}
          dir="auto"
          placeholder="e.g. Marcus Aurelius"
        />
        <Select
          label="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          error={errors.language}
          disabled={busy}
          hint="The language the book is written in."
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.nativeName}
            </option>
          ))}
        </Select>
      </div>

      {note && <p className="text-13 text-text-secondary">{note}</p>}

      <div className="flex flex-col-reverse gap-2.5 md:flex-row md:justify-end">
        <Button type="submit" loading={busy} fullWidth className="md:w-auto">
          {!busy && <Upload size={18} aria-hidden />}
          {busy ? "Uploading…" : "Upload book"}
        </Button>
      </div>
    </form>
  );
}
