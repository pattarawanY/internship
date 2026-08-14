import type { Author } from "@/lib/authors";

type AuthorListProps = {
  authors: Author[];
  selectedSlug?: string;
};

export default function AuthorList({ authors, selectedSlug }: AuthorListProps) {
  return (
    <section className="card flex w-full max-w-2xl flex-col gap-3 p-5 text-left">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="section-title">Authors</h2>
          <p className="section-sub">Loaded from GET /authors</p>
        </div>
        <a className="ghost-btn" href="/?new=1">
          New
        </a>
      </div>
      {authors.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">No authors yet. Create one below.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {authors.map((author) => {
            const active = author.authorSlug === selectedSlug;
            return (
              <li key={author.id}>
                <a
                  href={`/?slug=${encodeURIComponent(author.authorSlug)}`}
                  className={`block rounded-xl px-3 py-2 text-sm ${
                    active
                      ? "bg-[var(--ink)] text-[var(--paper)]"
                      : "hover:bg-[var(--paper-strong)]"
                  }`}
                >
                  {author.name}{" "}
                  <span className={active ? "opacity-80" : "text-[var(--muted)]"}>
                    /{author.authorSlug}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
