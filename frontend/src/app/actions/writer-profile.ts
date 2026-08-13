"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  LANGUAGES,
  validateSlug,
  type LanguageCode,
  type WriterProfile,
  emptyProfile,
} from "@/lib/writer-profile";

const COOKIE_KEY = "internship.writer-profile";

export type WriterProfileFields = Pick<
  WriterProfile,
  "authorSlug" | "slugLocked" | "details" | "pinnedLanguage"
>;

export async function getWriterProfile(): Promise<WriterProfileFields> {
  const jar = await cookies();
  const raw = jar.get(COOKIE_KEY)?.value;
  if (!raw) {
    const empty = emptyProfile();
    return {
      authorSlug: empty.authorSlug,
      slugLocked: empty.slugLocked,
      details: empty.details,
      pinnedLanguage: empty.pinnedLanguage,
    };
  }
  try {
    return JSON.parse(raw) as WriterProfileFields;
  } catch {
    const empty = emptyProfile();
    return {
      authorSlug: empty.authorSlug,
      slugLocked: empty.slugLocked,
      details: empty.details,
      pinnedLanguage: empty.pinnedLanguage,
    };
  }
}

export async function saveWriterProfile(formData: FormData) {
  const authorSlug = String(formData.get("authorSlug") ?? "")
    .trim()
    .toLowerCase();
  const pinnedLanguage = (String(formData.get("pinnedLanguage") ?? "th") ===
  "en"
    ? "en"
    : "th") as LanguageCode;

  const slugError = validateSlug(authorSlug);
  if (slugError) {
    redirect(`/?error=${encodeURIComponent(slugError)}`);
  }

  const details = Object.fromEntries(
    LANGUAGES.map(({ code }) => [
      code,
      {
        penName: String(formData.get(`penName_${code}`) ?? "").trim(),
        bio: String(formData.get(`bio_${code}`) ?? "").trim(),
      },
    ]),
  ) as WriterProfile["details"];

  if (!details.th.penName && !details.en.penName) {
    redirect(
      `/?error=${encodeURIComponent("Enter a pen name in at least one language")}`,
    );
  }

  const avatar = formData.get("avatar");
  const background = formData.get("background");

  const payload = {
    authorSlug,
    pinnedLanguage,
    details: LANGUAGES.map(({ code }) => ({
      languageCode: code,
      penName: details[code].penName,
      bio: details[code].bio || undefined,
    })),
    avatar:
      avatar instanceof File && avatar.size > 0
        ? { fileName: avatar.name, mimeType: avatar.type, size: avatar.size }
        : null,
    background:
      background instanceof File && background.size > 0
        ? {
            fileName: background.name,
            mimeType: background.type,
            size: background.size,
          }
        : null,
  };

  console.log("writer profile payload (POST to internship API later)", payload);

  const jar = await cookies();
  jar.set(
    COOKIE_KEY,
    JSON.stringify({
      authorSlug,
      slugLocked: true,
      details,
      pinnedLanguage,
    } satisfies WriterProfileFields),
    { path: "/", maxAge: 60 * 60 * 24 * 30 },
  );

  redirect("/?saved=1");
}
