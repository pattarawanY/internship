export type MediaItem = {
  uuid: string;
  storageKey: string;
  s3Url: string;
  mimeType: string;
  size: number;
  originalName: string;
  alt: string | null;
  folder: string;
};

export const resolveMediaDisplayUrl = (
  storageKey?: string | null,
  fileUrl?: string | null,
): string | null => {
  if (fileUrl) return fileUrl;
  if (!storageKey) return null;
  const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  return `${api}/uploads/${storageKey}`;
};
