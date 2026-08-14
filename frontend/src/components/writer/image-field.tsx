"use client";

import { useState } from "react";

import ModalUploadFile from "@/components/upload/modal-upload-file";
import type { MediaItem } from "@/lib/media";

type ImageFieldProps = {
  label: string;
  hint: string;
  variant: "cover" | "avatar";
  preview: string | null;
  autoAltText: string;
  onUploaded: (item: MediaItem) => void;
  onCleared: () => void;
};

export default function ImageField({
  label,
  hint,
  variant,
  preview,
  autoAltText,
  onUploaded,
  onCleared,
}: ImageFieldProps) {
  const [open, setOpen] = useState(false);
  const frameClass =
    variant === "cover"
      ? "h-44 w-full bg-[#dbeafe]"
      : "size-24 rounded-full bg-[var(--paper-strong)] ring-4 ring-[#fffdf8]";

  return (
    <>
      <div className={`relative ${variant === "avatar" ? "w-fit" : "w-full"}`}>
        <button
          type="button"
          className={`block cursor-pointer ${variant === "avatar" ? "w-fit" : "w-full"}`}
          onClick={() => setOpen(true)}
        >
          <span
            className={`relative block overflow-hidden border border-dashed border-[var(--line)] ${frameClass}`}
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt={label}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-3 text-center">
                <span className="text-sm font-medium text-[var(--ink)]">{label}</span>
                <span className="text-xs text-[var(--muted)]">{hint}</span>
              </span>
            )}
          </span>
        </button>
        {preview ? (
          <button
            type="button"
            className="overlay-btn absolute top-2 right-2"
            onClick={(event) => {
              event.stopPropagation();
              onCleared();
            }}
            aria-label={`Remove ${label}`}
          >
            X
          </button>
        ) : null}
      </div>
      <ModalUploadFile
        open={open}
        title={label}
        autoAltText={autoAltText}
        folder="contents"
        onClose={() => setOpen(false)}
        onUploaded={onUploaded}
      />
    </>
  );
}
