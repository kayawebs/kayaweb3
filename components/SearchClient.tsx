"use client";
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import Link from "next/link";

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

  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: [
        { name: "title", weight: 2 },
        { name: "summary", weight: 1.2 },
        { name: "tags", weight: 1.1 },
        { name: "content", weight: 0.8 },
      ],
      includeMatches: false,
      threshold: 0.35,
    });
  }, [items]);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return fuse.search(q).map((r) => r.item);
  }, [query, fuse]);

  const shown = query.trim() ? results : items.slice(0, 20);

  return (
    <div className="space-y-6">
      <div className="terminal-panel space-y-4">
        <div className="mb-1 flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
          <span className="terminal-accent">~/search</span>
          <span>grep -ri</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
          <p className="text-sm text-[var(--terminal-muted)]">
            Search blog titles, summaries, tags, and content.
          </p>
        </div>
        <input
          className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]"
          placeholder="Type to search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query.trim() && (
          <div className="text-xs font-mono text-[var(--terminal-muted)]">
            {results.length} result{results.length === 1 ? "" : "s"}
          </div>
        )}
      </div>

      <div className="terminal-panel">
        <ul className="space-y-3">
          {shown.map((post) => (
            <li key={`${post.category}-${post.slug}`} className="flex flex-col gap-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">
                <Link
                  href={`/blog/${post.category}/${post.slug}`}
                  className="min-w-0 break-words font-medium text-[var(--foreground)] hover:underline"
                >
                  {post.title}
                </Link>
                <span className="hidden text-xs font-mono text-[var(--terminal-muted)] sm:inline">
                  {post.date}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--terminal-muted)]">
                <span className="font-mono">/{post.category}/{post.slug}</span>
                {post.tags?.map((tag) => (
                  <span key={tag} className="rounded border border-[var(--terminal-border)] px-1.5 py-0.5 text-[10px] font-mono">
                    #{tag}
                  </span>
                ))}
                <span className="sm:hidden text-[11px] font-mono">{post.date}</span>
              </div>
              {post.summary && (
                <p className="text-sm text-[var(--foreground)]/80">{post.summary}</p>
              )}
            </li>
          ))}
          {shown.length === 0 && (
            <li className="text-sm text-[var(--terminal-muted)]">No results.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

