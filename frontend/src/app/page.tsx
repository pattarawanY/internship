import { getWriterProfile } from "@/app/actions/writer-profile";
import WriterProfileForm from "@/components/writer/writer-profile-form";

export const metadata = {
  title: "Writer Profile",
  description:
    "Create a writer profile with pen names and photos for your public author page.",
};

type HomeProps = {
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const [{ saved, error }, profile] = await Promise.all([
    searchParams,
    getWriterProfile(),
  ]);

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
      <WriterProfileForm
        profile={profile}
        saved={saved === "1"}
        error={error}
      />
    </main>
  );
}
