/** Source of truth for pen-name languages. Add an entry here to get a new radio tab. */
export const LANGUAGES = [
  { code: "th", label: "Thai" },
  { code: "en", label: "English" },
  { code: "jp", label: "Japanese" }, 
] as const;

export const SOCIAL_PLATFORMS = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "x", label: "X" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "website", label: "Website" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]["value"];

export const DEFAULT_LANGUAGE: LanguageCode = LANGUAGES[0].code;

export const isLanguageCode = (value: string): value is LanguageCode =>
  LANGUAGES.some((item) => item.code === value);

export const parseLanguageCode = (
  value: string | null | undefined,
): LanguageCode =>
  value && isLanguageCode(value) ? value : DEFAULT_LANGUAGE;

export const languageIndex = (code: LanguageCode) =>
  Math.max(
    0,
    LANGUAGES.findIndex((item) => item.code === code),
  );

export type StoredImage = {
  fileName: string;
  mimeType: string;
  dataUrl: string;
};

export type SocialRow = {
  id: string;
  platform: SocialPlatform | "";
  url: string;
};

export type PenNameDetail = {
  penName: string;
  bio: string;
};

export type WriterProfile = {
  authorSlug: string;
  slugLocked: boolean;
  avatar: StoredImage | null;
  background: StoredImage | null;
  socialLinks: SocialRow[];
  details: Record<LanguageCode, PenNameDetail>;
  pinnedLanguage: LanguageCode;
};

export const emptyDetails = (): Record<LanguageCode, PenNameDetail> =>
  LANGUAGES.reduce(
    (acc, { code }) => {
      acc[code] = { penName: "", bio: "" };
      return acc;
    },
    {} as Record<LanguageCode, PenNameDetail>,
  );

export const normalizeDetails = (
  details: Partial<Record<LanguageCode, PenNameDetail>> | undefined,
): Record<LanguageCode, PenNameDetail> =>
  LANGUAGES.reduce(
    (acc, { code }) => {
      acc[code] = {
        penName: details?.[code]?.penName ?? "",
        bio: details?.[code]?.bio ?? "",
      };
      return acc;
    },
    {} as Record<LanguageCode, PenNameDetail>,
  );

export const firstFilledValue = (
  details: Record<LanguageCode, PenNameDetail>,
  preferred: LanguageCode,
  field: keyof PenNameDetail,
): string => {
  const preferredValue = details[preferred]?.[field]?.trim() ?? "";
  if (preferredValue) return preferredValue;
  for (const { code } of LANGUAGES) {
    const value = details[code]?.[field]?.trim() ?? "";
    if (value) return value;
  }
  return "";
};

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const STORAGE_KEY = "internship.writer-profile";
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_IMAGE_EDGE = 1400;

export const emptyProfile = (): WriterProfile => ({
  authorSlug: "",
  slugLocked: false,
  avatar: null,
  background: null,
  socialLinks: [],
  details: emptyDetails(),
  pinnedLanguage: DEFAULT_LANGUAGE,
});

export const createRowId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const loadProfile = (): WriterProfile => {
  if (typeof window === "undefined") return emptyProfile();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProfile();
    const parsed = JSON.parse(raw) as Partial<WriterProfile>;
    return {
      ...emptyProfile(),
      ...parsed,
      details: normalizeDetails(parsed.details),
      pinnedLanguage: parseLanguageCode(parsed.pinnedLanguage),
    };
  } catch {
    return emptyProfile();
  }
};

export const saveProfileLocally = (profile: WriterProfile) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
};

/** Payload to POST to the internship backend when the API is ready */
export const toApiPayload = (profile: WriterProfile) => ({
  authorSlug: profile.authorSlug.trim().toLowerCase(),
  avatar: profile.avatar,
  background: profile.background,
  socialLinks: Object.fromEntries(
    profile.socialLinks
      .filter((row) => row.platform && row.url.trim())
      .map((row) => [row.platform, row.url.trim()]),
  ),
  details: LANGUAGES.map(({ code }) => ({
    languageCode: code,
    penName: profile.details[code].penName.trim(),
    bio: profile.details[code].bio.trim() || undefined,
  })),
  pinnedLanguage: profile.pinnedLanguage,
});

export const validateSlug = (slug: string): string | null => {
  const value = slug.trim().toLowerCase();
  if (value.length < 2) return "Slug must be at least 2 characters";
  if (value.length > 255) return "Slug is too long";
  if (!SLUG_PATTERN.test(value)) {
    return "Use lowercase kebab-case, e.g. jane-writer";
  }
  return null;
};

export const validateUrl = (url: string): string | null => {
  const value = url.trim();
  if (!value) return "Enter a URL";
  try {
    const parsed = new URL(value);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return "URL must start with http or https";
    }
    return null;
  } catch {
    return "Invalid URL";
  }
};

export const fileToStoredImage = async (file: File): Promise<StoredImage> => {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be 8MB or smaller");
  }

  const dataUrl = await readFile(file);
  const compressed = await compressImage(dataUrl, file.type);

  return {
    fileName: file.name,
    mimeType: compressed.startsWith("data:image/jpeg")
      ? "image/jpeg"
      : file.type,
    dataUrl: compressed,
  };
};

const readFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.readAsDataURL(file);
  });

const compressImage = (dataUrl: string, mimeType: string) =>
  new Promise<string>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(
        1,
        MAX_IMAGE_EDGE / Math.max(image.width, image.height),
      );
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext("2d");
      if (!context) {
        resolve(dataUrl);
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const outputType = mimeType === "image/png" ? "image/png" : "image/jpeg";
      resolve(canvas.toDataURL(outputType, 0.82));
    };
    image.onerror = () => reject(new Error("Could not open the image"));
    image.src = dataUrl;
  });
