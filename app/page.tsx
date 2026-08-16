import Link from "next/link";

import { getAllPosts } from "@/lib/blog";

const projects = [
  {
    name: "Kaya Tools",
    description: "Browser-native utilities for Web3, development, files, and everyday work.",
    href: "/tools",
    meta: "Explore the toolbox",
  },
  {
    name: "Paste",
    description: "Share a note, log, or code snippet with an expiring link.",
    href: "/tools/paste",
    meta: "Create a temporary link",
  },
  {
    name: "Video Lab",
    description: "Experiments in visual explanations for programming concepts.",
    href: "/video-lab/rust-ownership-episode-1",
    meta: "Watch the first study",
  },
];

export default function Home() {
  const posts = getAllPosts();
  const latestPost = posts[0];

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="max-w-3xl">
          <p className="eyebrow">Independent builder · Web3 & the web</p>
          <h1>I make useful systems, then write down what I learn.</h1>
          <p className="home-hero-copy">
            Kaya is a home for practical browser tools, on-chain experiments, and clear technical notes about the systems behind them.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/tools" className="button-primary">Browse tools <span aria-hidden="true">↗</span></Link>
            <Link href="/blog" className="button-secondary">Read the journal</Link>
          </div>
        </div>
        <div className="home-hero-aside">
          <div className="home-aside-mark">K</div>
          <p className="eyebrow">Current focus</p>
          <p className="mt-3 text-lg font-semibold tracking-[-0.035em]">Chain data, developer experience, and tools that stay out of your way.</p>
          <p className="mt-5 text-sm leading-6 text-[var(--muted)]">Most utilities run in your browser. The few that need a service use a small public API with deliberate limits.</p>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Start here</p>
            <h2>Things to use</h2>
          </div>
          <Link href="/tools" className="text-link">All tools</Link>
        </div>
        <div className="home-project-grid">
          {projects.map((project, index) => (
            <Link key={project.name} href={project.href} className={`home-project-card home-project-${index + 1}`}>
              <span className="font-mono text-xs text-[var(--muted)]">0{index + 1}</span>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <span className="home-project-link">{project.meta} <span aria-hidden="true">↗</span></span>
            </Link>
          ))}
        </div>
      </section>

      {latestPost ? (
        <section className="home-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Latest note</p>
              <h2>From the journal</h2>
            </div>
            <Link href="/blog" className="text-link">All writing</Link>
          </div>
          <Link href={`/blog/${latestPost.category}/${latestPost.slug}`} className="latest-note-card">
            <div className="latest-note-index">{latestPost.date}</div>
            <div>
              <p className="eyebrow">{latestPost.category}</p>
              <h3>{latestPost.title}</h3>
              {latestPost.summary ? <p>{latestPost.summary}</p> : null}
            </div>
            <span className="latest-note-arrow" aria-hidden="true">↗</span>
          </Link>
        </section>
      ) : null}
    </main>
  );
}
