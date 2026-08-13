import { saveWriterProfile } from "@/app/actions/writer-profile";
import ImageField from "@/components/writer/image-field";
import PenNameFields from "@/components/writer/pen-name-fields";
import type { WriterProfileFields } from "@/app/actions/writer-profile";

type WriterProfileFormProps = {
  profile: WriterProfileFields;
  saved?: boolean;
  error?: string;
};

export default function WriterProfileForm({
  profile,
  saved,
  error,
}: WriterProfileFormProps) {
  const displayName =
    profile.details[profile.pinnedLanguage].penName.trim() ||
    profile.details.th.penName.trim() ||
    profile.details.en.penName.trim() ||
    profile.authorSlug ||
    "Writer";

  return (
    <form
      className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6"
      action={saveWriterProfile}
    >
      <section className="card w-full overflow-hidden text-center">
        <ImageField
          name="background"
          label="Cover photo"
          hint="Click to upload"
          variant="cover"
        />

        <div className="flex flex-col items-center gap-1 px-5 pb-5">
          <div className="-mt-12">
            <ImageField
              name="avatar"
              label="Avatar"
              hint="Click to upload"
              variant="avatar"
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
            defaultValue={profile.authorSlug}
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
          details={profile.details}
          pinnedLanguage={profile.pinnedLanguage}
        />
      </section>

      <div className="flex w-full flex-col items-center gap-2">
        {error ? (
          <p className="text-sm text-[var(--danger)]">{error}</p>
        ) : null}
        {saved && !error ? (
          <p className="text-sm text-[var(--muted)]">Profile saved.</p>
        ) : null}
        <button type="submit" className="primary-btn">
          Save profile
        </button>
      </div>
    </form>
  );
}
