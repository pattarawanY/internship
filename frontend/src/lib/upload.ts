import { apiUrl } from "@/lib/api";
import type { MediaItem } from "@/lib/media";

export const uploadImage = async (options: {
  file: File;
  folder?: string;
  alt?: string;
}): Promise<MediaItem> => {
  const { file, folder = "contents", alt } = options;
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  if (alt) form.append("alt", alt);

  const response = await fetch(apiUrl("/upload"), {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    let message = "Could not upload the image";
    try {
      const body = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(body.message)) message = body.message.join(", ");
      else if (body.message) message = body.message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  return (await response.json()) as MediaItem;
};
