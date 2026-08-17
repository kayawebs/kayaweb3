import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

import SortVisualizer from "@/components/SortVisualizer";
import { getPost } from "@/lib/blog";

interface PageParams {
  category: string;
  slug: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const post = getPost(category, slug);
  if (!post) return { title: "Article not found | Kaya" };
  return { title: post.title, description: post.summary };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { category, slug } = await params;
  const post = getPost(category, slug);
  if (!post) notFound();

  return (
    <main className="article-page">
      <article>
        <header className="article-header">
          <div className="article-breadcrumbs">
            <Link href="/blog">Blog</Link><span>/</span><Link href={`/blog/${category}`}>{category}</Link>
          </div>
          <p className="eyebrow mt-8">{post.category} · {post.date}</p>
          <h1>{post.title}</h1>
          {post.summary ? <p className="article-summary">{post.summary}</p> : null}
          {post.tags?.length ? (
            <div className="journal-tags mt-6">
              {post.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          ) : null}
        </header>

        <div className="article-prose prose max-w-none">
          <MDXRemote
            source={post.content}
            options={{ mdxOptions: { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] } }}
            components={{ SortViz: SortVisualizer }}
          />
        </div>
      </article>
      <aside className="article-endcap">
        <span className="eyebrow">End of note</span>
        <Link href="/blog" className="text-link">Back to journal</Link>
      </aside>
    </main>
  );
}
