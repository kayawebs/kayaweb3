import Link from "next/link";

import { getAllPosts } from "@/lib/blog";

export default async function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 pb-16 pt-12 sm:px-10 sm:pt-16">
        <section className="terminal-panel">
          <div className="mb-4 flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
            <span className="terminal-accent">~/blog</span>
            <span>ls -la</span>
          </div>
          <div className="space-y-4">
            <header className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">所有博客</h1>
              <p className="text-sm text-[var(--terminal-muted)]">
                按时间倒序列出所有文章，点击标题可查看详情。
              </p>
            </header>

            <ul className="divide-y divide-[var(--terminal-border)] border border-[var(--terminal-border)] rounded-md bg-[var(--terminal-panel-bg)]/40">
              {posts.map((post) => (
                <li key={`${post.category}-${post.slug}`} className="flex flex-col gap-1 px-3 sm:px-4 py-3 text-sm hover:bg-[var(--terminal-panel-bg)]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">
                    <Link
                      href={`/blog/${post.category}/${post.slug}`}
                      className="block min-w-0 break-words font-medium text-[var(--foreground)] hover:underline"
                    >
                      {post.title}
                    </Link>
                    <span className="hidden text-xs font-mono text-[var(--terminal-muted)] sm:inline">
                      {post.date}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 text-xs text-[var(--terminal-muted)]">
                    <span className="min-w-0 truncate font-mono">/{post.category}/{post.slug}</span>
                    <span className="sm:hidden text-[11px] font-mono">{post.date}</span>
                    {post.summary && (
                      <span className="min-w-0 truncate text-right sm:max-w-xs">
                        {post.summary}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
