"use client";

import Link from "next/link";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";

type SearchItem = {
  title: string;
  date: string;
  category: string;
  slug: string;
  summary?: string;
  tags?: string[];
  content: string;
};

export default function SearchClient({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const fuse = useMemo(() => new Fuse(items, {
    keys: [
      { name: "title", weight: 2 },
      { name: "summary", weight: 1.2 },
      { name: "tags", weight: 1.1 },
      { name: "content", weight: 0.8 },
    ],
    includeMatches: false,
    threshold: 0.35,
  }), [items]);
  const results = useMemo(() => {
    const normalizedQuery = query.trim();
    return normalizedQuery ? fuse.search(normalizedQuery).map((result) => result.item) : items;
  }, [fuse, items, query]);

  return (
    <main className="search-page">
      <header className="search-header">
        <p className="eyebrow">Search the journal</p>
        <h1>Find a note.</h1>
        <p>Search article titles, tags, summaries, and full content.</p>
        <div className="search-input-shell">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.4" /><path d="m16 16 4.1 4.1" /></svg>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try Rust, Bitcoin, sorting..."
            aria-label="Search the journal"
            autoFocus
          />
        </div>
      </header>

      <section className="search-results" aria-live="polite">
        <div className="mb-4 flex justify-between gap-4 text-sm text-[var(--muted)]">
          <span>{query.trim() ? "Matches" : "Latest notes"}</span>
          <span className="font-mono text-xs">{results.length} results</span>
        </div>
        {results.length > 0 ? results.map((post) => (
          <article key={`${post.category}-${post.slug}`} className="search-result-card">
            <div className="search-result-meta"><span>{post.date}</span><span>{post.category}</span></div>
            <div>
              <Link href={`/blog/${post.category}/${post.slug}`} className="search-result-title">{post.title}</Link>
              {post.summary ? <p>{post.summary}</p> : null}
              {post.tags?.length ? <div className="journal-tags mt-3">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div> : null}
            </div>
            <Link href={`/blog/${post.category}/${post.slug}`} aria-label={`Read ${post.title}`} className="search-result-arrow">↗</Link>
          </article>
        )) : (
          <p className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--muted)]">No notes match that search.</p>
        )}
      </section>
    </main>
  );
}
