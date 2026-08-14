import { notFound } from "next/navigation";

import { ApiError } from "@/lib/api";
import { getAuthorBySlug } from "@/lib/authors";
import { resolveMediaDisplayUrl } from "@/lib/media";

type PublicAuthorPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PublicAuthorPage({
  params,
}: PublicAuthorPageProps) {
  const { slug } = await params;

  let author;
  try {
    author = await getAuthorBySlug(slug);
  } catch (cause) {
    if (cause instanceof ApiError && cause.status === 404) notFound();
    throw cause;
  }

  const avatarUrl = resolveMediaDisplayUrl(
    author.avatarStorageKey,
    author.avatarUrl,
  );
  const backgroundUrl = resolveMediaDisplayUrl(
    author.backgroundStorageKey,
    author.backgroundUrl,
  );

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-8 text-center">
      <section className="card w-full overflow-hidden">
        <div className="relative h-44 w-full bg-[#dbeafe]">
          {backgroundUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={backgroundUrl}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
          ) : null}
        </div>
        <div className="flex flex-col items-center px-5 pb-5">
          <div className="-mt-12 size-24 overflow-hidden rounded-full bg-[var(--paper-strong)] ring-4 ring-[#fffdf8]">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={author.name}
                className="size-full object-cover"
              />
            ) : null}
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-[var(--ink)]">
            {author.name}
          </h1>
          {author.bio ? (
            <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">
              {author.bio}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
