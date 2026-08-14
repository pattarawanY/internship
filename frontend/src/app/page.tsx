import AuthorList from "@/components/writer/author-list";
import WriterProfileForm from "@/components/writer/writer-profile-form";
import { ApiError } from "@/lib/api";
import {
  authorToForm,
  emptyWriterProfile,
  getAuthorBySlug,
  listAuthors,
} from "@/lib/authors";

export const metadata = {
  title: "Writer Profile",
  description:
    "Create a writer profile with pen names and photos for your public author page.",
};

type HomeProps = {
  searchParams: Promise<{ saved?: string; error?: string; slug?: string; new?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { saved, error, slug, new: isNew } = await searchParams;

  let loadError = error ?? null;
  let authors = [] as Awaited<ReturnType<typeof listAuthors>>["data"];
  let profile = emptyWriterProfile();

  try {
    const list = await listAuthors(1, 20);
    authors = list.data;

    if (isNew === "1") {
      profile = emptyWriterProfile();
    } else if (slug) {
      const author = await getAuthorBySlug(slug);
      profile = authorToForm(author);
    } else if (authors[0]) {
      profile = authorToForm(authors[0]);
    }
  } catch (cause) {
    loadError =
      cause instanceof ApiError
        ? cause.message
        : "Could not load authors from the backend";
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-8 text-center">
      <header className="flex flex-col items-center gap-1">
        <h1 className="text-3xl font-semibold text-[var(--ink)]">
          Writer Profile
        </h1>
        <p className="max-w-xl text-sm text-[var(--muted)]">
          Avatar, background, slug, and pen names for your public author page.
        </p>
      </header>
      {loadError ? (
        <p className="text-sm text-[var(--danger)]">{loadError}</p>
      ) : null}
      <WriterProfileForm
        key={profile.id ?? "new"}
        profile={profile}
        saved={saved === "1"}
      />
    </main>
  );
}
