import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatBlogCategory, getBlogCategories, getPostsByCategory } from "@/lib/blog";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return getBlogCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const posts = getPostsByCategory(category);

  if (!posts.length) return { title: "Blog category not found | Kaya" };

  const label = formatBlogCategory(category);
  return {
    title: `${label} Blog Posts | Kaya`,
    description: `Browse Kaya's ${label.toLowerCase()} writing, practical notes, and technical explainers.`,
  };
}

export default async function BlogCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const posts = getPostsByCategory(category);

  if (!posts.length) notFound();

  const label = formatBlogCategory(category);

  return (
    <main className="journal-page">
      <header className="journal-intro">
        <div className="article-breadcrumbs"><Link href="/blog">Blog</Link><span>/</span><span>{label}</span></div>
        <p className="eyebrow mt-8">Category archive</p>
        <h1>{label}</h1>
        <p>{posts.length} notes in the {label.toLowerCase()} category.</p>
      </header>

      <section className="journal-list-section" aria-labelledby="category-posts">
        <div className="section-heading">
          <div>
            <p className="eyebrow">All posts</p>
            <h2 id="category-posts">{label} reading list</h2>
          </div>
          <Link href="/blog" className="text-link">All categories</Link>
        </div>
        <div className="journal-list">
          {posts.map((post) => (
            <article key={post.slug} className="journal-list-item">
              <div className="journal-list-meta"><span>{post.date}</span><span>{post.category}</span></div>
              <div>
                <Link href={`/blog/${post.category}/${post.slug}`} className="journal-list-title">{post.title}</Link>
                {post.summary ? <p>{post.summary}</p> : null}
                {post.tags?.length ? <div className="journal-tags">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div> : null}
              </div>
              <Link href={`/blog/${post.category}/${post.slug}`} className="journal-list-arrow" aria-label={`Read ${post.title}`}>↗</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
