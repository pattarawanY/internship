import { apiFetch } from "@/lib/api";
import {
  DEFAULT_LANGUAGE,
  emptyDetails,
  emptyProfile,
  firstFilledValue,
  LANGUAGES,
  parseLanguageCode,
  type LanguageCode,
  type PenNameDetail,
  type WriterProfile,
} from "@/lib/writer-profile";

export type Author = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  authorSlug: string;
  avatarMediaUuid: string | null;
  backgroundMediaUuid: string | null;
  avatarUrl: string | null;
  backgroundUrl: string | null;
  avatarStorageKey: string | null;
  backgroundStorageKey: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthorList = {
  data: Author[];
  total: number;
  page: number;
  limit: number;
};

export type WriterProfileFields = Pick<
  WriterProfile,
  "authorSlug" | "slugLocked" | "details" | "pinnedLanguage"
> & {
  id?: number;
  avatarMediaUuid?: string | null;
  backgroundMediaUuid?: string | null;
  avatarUrl?: string | null;
  backgroundUrl?: string | null;
  avatarStorageKey?: string | null;
  backgroundStorageKey?: string | null;
};

export type SaveAuthorPayload = {
  name: string;
  bio?: string;
  authorSlug: string;
  avatarMediaUuid?: string | null;
  backgroundMediaUuid?: string | null;
};

export const emptyWriterProfile = (): WriterProfileFields => {
  const empty = emptyProfile();
  return {
    authorSlug: empty.authorSlug,
    slugLocked: empty.slugLocked,
    details: empty.details,
    pinnedLanguage: empty.pinnedLanguage,
  };
};

export const authorToForm = (author: Author): WriterProfileFields => ({
  id: author.id,
  authorSlug: author.authorSlug,
  slugLocked: true,
  pinnedLanguage: DEFAULT_LANGUAGE,
  details: {
    ...emptyDetails(),
    [DEFAULT_LANGUAGE]: { penName: author.name, bio: author.bio ?? "" },
  },
  avatarMediaUuid: author.avatarMediaUuid,
  backgroundMediaUuid: author.backgroundMediaUuid,
  avatarUrl: author.avatarUrl,
  backgroundUrl: author.backgroundUrl,
  avatarStorageKey: author.avatarStorageKey,
  backgroundStorageKey: author.backgroundStorageKey,
});

export const listAuthors = (page = 1, limit = 20) =>
  apiFetch<AuthorList>(`/authors?page=${page}&limit=${limit}`);

export const getAuthorBySlug = (slug: string) =>
  apiFetch<Author>(`/authors/${encodeURIComponent(slug)}`);

export const createAuthor = (payload: SaveAuthorPayload) =>
  apiFetch<Author>("/authors", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateAuthor = (id: number, payload: Omit<SaveAuthorPayload, "authorSlug">) =>
  apiFetch<Author>(`/authors/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteAuthor = (id: number) =>
  apiFetch<void>(`/authors/${id}`, { method: "DELETE" });

export const buildSavePayload = (
  formData: FormData,
): SaveAuthorPayload & { id?: number; pinnedLanguage: LanguageCode } => {
  const authorSlug = String(formData.get("authorSlug") ?? "")
    .trim()
    .toLowerCase();
  const pinnedLanguage = parseLanguageCode(
    String(formData.get("pinnedLanguage") ?? ""),
  );
  const details = LANGUAGES.reduce(
    (acc, { code }) => {
      acc[code] = {
        penName: String(formData.get(`penName_${code}`) ?? "").trim(),
        bio: String(formData.get(`bio_${code}`) ?? "").trim(),
      };
      return acc;
    },
    {} as Record<LanguageCode, PenNameDetail>,
  );
  const name =
    firstFilledValue(details, pinnedLanguage, "penName") || authorSlug;
  const bio = firstFilledValue(details, pinnedLanguage, "bio") || undefined;
  const authorId = String(formData.get("authorId") ?? "").trim();
  const clearAvatar = String(formData.get("clearAvatar") ?? "") === "1";
  const clearBackground = String(formData.get("clearBackground") ?? "") === "1";
  const avatarMediaUuid = String(formData.get("avatarMediaUuid") ?? "").trim();
  const backgroundMediaUuid = String(
    formData.get("backgroundMediaUuid") ?? "",
  ).trim();

  return {
    id: authorId ? Number(authorId) : undefined,
    name,
    bio,
    authorSlug,
    pinnedLanguage,
    avatarMediaUuid: clearAvatar ? null : avatarMediaUuid || undefined,
    backgroundMediaUuid: clearBackground
      ? null
      : backgroundMediaUuid || undefined,
  };
};
