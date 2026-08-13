"use client";

import { useState } from "react";

type ImageFieldProps = {
  name: string;
  label: string;
  hint: string;
  variant: "cover" | "avatar";
};

export default function ImageField({
  name,
  label,
  hint,
  variant,
}: ImageFieldProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const frameClass =
    variant === "cover"
      ? "h-44 w-full bg-[#dbeafe]"
      : "size-24 rounded-full bg-[var(--paper-strong)] ring-4 ring-[#fffdf8]";

  return (
    <label className={`block cursor-pointer ${variant === "avatar" ? "w-fit" : "w-full"}`}>
      <input
        type="file"
        name={name}
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          setPreview(file ? URL.createObjectURL(file) : null);
        }}
      />
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
    </label>
  );
}
