import Link from "next/link";

import { getAllPosts, getBlogCategories } from "@/lib/blog";

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const categories = getBlogCategories();
  const featured = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <main className="journal-page">
      <header className="journal-intro">
        <p className="eyebrow">Kaya Blog · Journal</p>
        <h1>Notes, grouped by subject.</h1>
        <p>The journal is Kaya&apos;s blog collection: practical writing on blockchain systems, frontend engineering, developer workflows, and the mental models behind them.</p>
      </header>

      <section className="journal-category-overview" aria-labelledby="journal-categories">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Browse by category</p>
            <h2 id="journal-categories">Choose a subject</h2>
          </div>
          <span className="font-mono text-xs text-[var(--muted)]">{categories.length} categories</span>
        </div>
        <div className="journal-category-grid">
          {categories.map((category) => (
            <Link key={category.slug} href={`/blog/${category.slug}`} className="journal-category-card">
              <span className="journal-category-count">{String(category.count).padStart(2, "0")}</span>
              <span className="journal-category-name">{category.label}</span>
              <span className="journal-category-link">Browse <span aria-hidden="true">↗</span></span>
            </Link>
          ))}
        </div>
      </section>

      {featured ? (
        <Link href={`/blog/${featured.category}/${featured.slug}`} className="journal-feature">
          <div className="journal-feature-meta">
            <span>{featured.date}</span>
            <span>{featured.category}</span>
          </div>
          <div>
            <h2>{featured.title}</h2>
            {featured.summary ? <p>{featured.summary}</p> : null}
            <span className="text-link">Read note <span aria-hidden="true">↗</span></span>
          </div>
        </Link>
      ) : null}

      <section className="journal-list-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Latest across the blog</p>
            <h2>Recent notes</h2>
          </div>
          <span className="font-mono text-xs text-[var(--muted)]">{posts.length} entries</span>
        </div>
        <div className="journal-list">
          {remainingPosts.map((post) => (
            <article key={`${post.category}-${post.slug}`} className="journal-list-item">
              <div className="journal-list-meta">
                <span>{post.date}</span>
                <span>{post.category}</span>
              </div>
              <div>
                <Link href={`/blog/${post.category}/${post.slug}`} className="journal-list-title">{post.title}</Link>
                {post.summary ? <p>{post.summary}</p> : null}
                {post.tags?.length ? (
                  <div className="journal-tags">
                    {post.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                ) : null}
              </div>
              <Link href={`/blog/${post.category}/${post.slug}`} className="journal-list-arrow" aria-label={`Read ${post.title}`}>↗</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
