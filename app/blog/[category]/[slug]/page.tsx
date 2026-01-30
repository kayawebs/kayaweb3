import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import SortVisualizer from "@/components/SortVisualizer";

import { getPost } from "@/lib/blog";

interface PageParams {
  category: string;
  slug: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export async function generateMetadata(
  props: { params: Promise<PageParams> },
): Promise<Metadata> {
  const params = await props.params;

  if (!params?.category || !params?.slug) {
    return { title: "文章未找到" };
  }

  const post = getPost(params.category, params.slug);

  if (!post) {
    return {
      title: "文章未找到",
    };
  }

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function BlogPostPage(props: PageProps) {
  const params = await props.params;
  const post = getPost(params.category, params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-6 pb-16 pt-12 sm:px-10 sm:pt-16">
        <section className="terminal-panel">
          <div className="mb-4 flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
            <span className="terminal-accent">~/blog/{`${params.category}/${params.slug}`}</span>
            <span>cat post.mdx</span>
          </div>

          <article>
            <header className="mb-6 border-b border-[var(--terminal-border)] pb-4">
              <h1 className="mb-2 text-2xl font-semibold leading-tight tracking-tight break-words">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--terminal-muted)]">
                <span>{post.date}</span>
                <span>·</span>
                <span>/{post.category}/{post.slug}</span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--terminal-border)] px-2 py-0.5 text-[11px] font-mono text-[var(--terminal-muted)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              {post.summary && (
                <p className="mt-3 text-sm text-[var(--foreground)]/80">{post.summary}</p>
              )}
            </header>

            <div className="mt-6 prose prose-invert max-w-none prose-headings:font-semibold prose-headings:break-words prose-a:text-[var(--terminal-accent)] prose-a:no-underline hover:prose-a:underline prose-code:text-[var(--terminal-accent)] prose-pre:bg-[var(--terminal-panel-bg)] prose-table:table-auto prose-table:w-full prose-th:text-left prose-th:whitespace-nowrap prose-td:align-top">
              <MDXRemote
                source={post.content}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkMath],
                    rehypePlugins: [rehypeKatex],
                  },
                }}
                components={{
                  SortViz: SortVisualizer,
                }}
              />
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
