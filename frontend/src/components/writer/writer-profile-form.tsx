"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import ImageField from "@/components/writer/image-field";
import PenNameFields from "@/components/writer/pen-name-fields";
import {
  buildSavePayload,
  createAuthor,
  updateAuthor,
  type WriterProfileFields,
} from "@/lib/authors";
import { ApiError } from "@/lib/api";
import { resolveMediaDisplayUrl } from "@/lib/media";
import type { MediaItem } from "@/lib/media";
import {
  firstFilledValue,
  validateSlug,
  type LanguageCode,
  type PenNameDetail,
} from "@/lib/writer-profile";

type WriterProfileFormProps = {
  profile: WriterProfileFields;
  saved?: boolean;
};

type ImageState = {
  uuid: string | null;
  preview: string | null;
  cleared: boolean;
};

const toImageState = (
  uuid: string | null | undefined,
  storageKey: string | null | undefined,
  url: string | null | undefined,
): ImageState => ({
  uuid: uuid ?? null,
  preview: resolveMediaDisplayUrl(storageKey, url),
  cleared: false,
});

const sameImage = (current: ImageState, initial: ImageState) =>
  current.uuid === initial.uuid && current.cleared === false;

export default function WriterProfileForm({
  profile,
  saved,
}: WriterProfileFormProps) {
  const router = useRouter();
  const initialAvatar = useMemo(
    () =>
      toImageState(
        profile.avatarMediaUuid,
        profile.avatarStorageKey,
        profile.avatarUrl,
      ),
    [profile.avatarMediaUuid, profile.avatarStorageKey, profile.avatarUrl],
  );
  const initialBackground = useMemo(
    () =>
      toImageState(
        profile.backgroundMediaUuid,
        profile.backgroundStorageKey,
        profile.backgroundUrl,
      ),
    [
      profile.backgroundMediaUuid,
      profile.backgroundStorageKey,
      profile.backgroundUrl,
    ],
  );

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(Boolean(saved));
  const [avatar, setAvatar] = useState<ImageState>(initialAvatar);
  const [background, setBackground] = useState<ImageState>(initialBackground);
  const [authorSlug, setAuthorSlug] = useState(profile.authorSlug);
  const [details, setDetails] = useState(profile.details);
  const [pinnedLanguage, setPinnedLanguage] = useState(profile.pinnedLanguage);
  const [fieldsKey, setFieldsKey] = useState(0);

  const isDirty =
    !sameImage(avatar, initialAvatar) ||
    !sameImage(background, initialBackground) ||
    authorSlug !== profile.authorSlug ||
    pinnedLanguage !== profile.pinnedLanguage ||
    JSON.stringify(details) !== JSON.stringify(profile.details);

  const displayName =
    firstFilledValue(details, pinnedLanguage, "penName") ||
    authorSlug ||
    "Writer";

  const onAvatarUploaded = (item: MediaItem) => {
    setAvatar({
      uuid: item.uuid,
      preview: resolveMediaDisplayUrl(item.storageKey, item.s3Url),
      cleared: false,
    });
  };

  const onBackgroundUploaded = (item: MediaItem) => {
    setBackground({
      uuid: item.uuid,
      preview: resolveMediaDisplayUrl(item.storageKey, item.s3Url),
      cleared: false,
    });
  };

  const onClearAvatar = () => {
    if (!window.confirm("Remove this profile photo?")) return;
    setAvatar({ uuid: null, preview: null, cleared: true });
  };

  const onClearBackground = () => {
    if (!window.confirm("Remove this cover photo?")) return;
    setBackground({ uuid: null, preview: null, cleared: true });
  };

  const onCancel = () => {
    setAvatar(initialAvatar);
    setBackground(initialBackground);
    setAuthorSlug(profile.authorSlug);
    setDetails(profile.details);
    setPinnedLanguage(profile.pinnedLanguage);
    setError(null);
    setShowSaved(false);
    setFieldsKey((value) => value + 1);
  };

  const onPenNameChange = (
    nextDetails: Record<LanguageCode, PenNameDetail>,
    nextLanguage: LanguageCode,
  ) => {
    setDetails(nextDetails);
    setPinnedLanguage(nextLanguage);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const payload = buildSavePayload(formData);

    const slugError = validateSlug(payload.authorSlug);
    if (slugError) {
      setError(slugError);
      return;
    }
    if (!payload.name) {
      setError("Enter a pen name in at least one language");
      return;
    }

    setBusy(true);
    try {
      const author = payload.id
        ? await updateAuthor(payload.id, {
            name: payload.name,
            bio: payload.bio,
            avatarMediaUuid: payload.avatarMediaUuid,
            backgroundMediaUuid: payload.backgroundMediaUuid,
          })
        : await createAuthor({
            name: payload.name,
            bio: payload.bio,
            authorSlug: payload.authorSlug,
            avatarMediaUuid: payload.avatarMediaUuid,
            backgroundMediaUuid: payload.backgroundMediaUuid,
          });

      setShowSaved(true);
      router.push(`/?slug=${encodeURIComponent(author.authorSlug)}&saved=1`);
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof ApiError ? cause.message : "Could not save the profile",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6"
      onSubmit={onSubmit}
    >
      <input type="hidden" name="authorId" value={profile.id ?? ""} />
      <input type="hidden" name="avatarMediaUuid" value={avatar.uuid ?? ""} />
      <input
        type="hidden"
        name="backgroundMediaUuid"
        value={background.uuid ?? ""}
      />
      <input type="hidden" name="clearAvatar" value={avatar.cleared ? "1" : "0"} />
      <input
        type="hidden"
        name="clearBackground"
        value={background.cleared ? "1" : "0"}
      />

      <section className="card w-full overflow-hidden text-center">
        <ImageField
          label="Cover photo"
          hint="Click to upload"
          variant="cover"
          preview={background.preview}
          autoAltText={`Cover photo of ${displayName}`}
          onUploaded={onBackgroundUploaded}
          onCleared={onClearBackground}
        />

        <div className="flex flex-col items-center gap-1 px-5 pb-5">
          <div className="-mt-12">
            <ImageField
              label="Avatar"
              hint="Click to upload"
              variant="avatar"
              preview={avatar.preview}
              autoAltText={`Profile photo of ${displayName}`}
              onUploaded={onAvatarUploaded}
              onCleared={onClearAvatar}
            />
          </div>
          <p className="mt-2 text-2xl font-semibold text-[var(--ink)]">
            {displayName}
          </p>
        </div>
      </section>

      <section className="card flex w-full flex-col items-center gap-4 p-5 text-center">
        <div>
          <h2 className="section-title">Public profile</h2>
          <p className="section-sub">
            The slug is used in your public URL and is locked after you create
            the profile.
          </p>
        </div>
        <label className="field w-full text-left">
          <span>Author slug</span>
          <input
            name="authorSlug"
            value={authorSlug}
            onChange={(event) => setAuthorSlug(event.target.value)}
            readOnly={profile.slugLocked}
            placeholder="jane-writer"
            className="input"
            required
            minLength={2}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
          />
          <small>Lowercase kebab-case, e.g. jane-writer</small>
        </label>
      </section>

      <section className="card flex w-full flex-col items-center gap-4 p-5 text-center">
        <div>
          <h2 className="section-title">Pen name</h2>
          <p className="section-sub">
            Choose one language, then edit the display name and bio.
          </p>
        </div>
        <PenNameFields
          key={fieldsKey}
          details={details}
          pinnedLanguage={pinnedLanguage}
          onChange={onPenNameChange}
        />
      </section>

      <div className="flex w-full flex-col items-center gap-2">
        {error ? (
          <p className="text-sm text-[var(--danger)]">{error}</p>
        ) : null}
        {showSaved && !error && !isDirty ? (
          <p className="text-sm text-[var(--muted)]">Profile saved.</p>
        ) : null}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button type="submit" className="primary-btn" disabled={busy}>
            {busy ? "Saving…" : "Save profile"}
          </button>
          <button
            type="button"
            className="ghost-btn"
            onClick={onCancel}
            disabled={busy || !isDirty}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
