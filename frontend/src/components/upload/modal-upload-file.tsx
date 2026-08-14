"use client";

import { useState } from "react";

import { uploadImage } from "@/lib/upload";
import type { MediaItem } from "@/lib/media";

type ModalUploadFileProps = {
  open: boolean;
  title: string;
  autoAltText: string;
  folder?: string;
  onClose: () => void;
  onUploaded: (item: MediaItem) => void;
};

export default function ModalUploadFile({
  open,
  title,
  autoAltText,
  folder = "contents",
  onClose,
  onUploaded,
}: ModalUploadFileProps) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  if (!open) return null;

  const uploadFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const item = await uploadImage({
        file,
        folder,
        alt: autoAltText,
      });
      onUploaded(item);
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="card w-full max-w-md p-5 text-left">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="section-title">{title}</h2>
            <p className="section-sub">Choose or drop an image. Alt text is set automatically.</p>
          </div>
          <button type="button" className="ghost-btn" onClick={onClose} disabled={busy}>
            Close
          </button>
        </div>

        <label
          className={`flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-8 text-center ${
            dragging ? "border-[var(--ink)] bg-[var(--paper-strong)]" : "border-[var(--line)]"
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            void uploadFile(event.dataTransfer.files[0]);
          }}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={busy}
            onChange={(event) => {
              void uploadFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <span className="text-sm font-medium text-[var(--ink)]">
            {busy ? "Uploading…" : "Click or drop a photo"}
          </span>
          <span className="mt-1 text-xs text-[var(--muted)]">JPEG, PNG, WebP, GIF</span>
        </label>

        {error ? <p className="mt-3 text-sm text-[var(--danger)]">{error}</p> : null}
      </div>
    </div>
  );
}
