import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Kaya",
  description: "Privacy information for Kaya's journal, browser tools, analytics, and temporary paste service.",
};

const updatedAt = "2026-08-16";

export default function PrivacyPage() {
  return (
    <main className="policy-page">
      <header className="policy-header">
        <p className="eyebrow">Kaya</p>
        <h1>Privacy is a feature, not a footnote.</h1>
        <p className="policy-intro">This page explains what runs locally, what is measured, and what is temporarily stored when you use a server-backed tool.</p>
        <p className="mt-5 font-mono text-xs text-[var(--muted)]">Last updated: {updatedAt}</p>
      </header>

      <article className="policy-content">
        <section>
          <h2>Scope</h2>
          <p>Kaya includes a journal, search, and practical browser tools. Most tools do not require an account and process their input entirely in your browser.</p>
        </section>
        <section>
          <h2>Analytics</h2>
          <p>Kaya uses Vercel Web Analytics to understand page visits, referral paths, browser and device class, and broad country-level trends. It is used to measure useful pages and improve performance.</p>
        </section>
        <section>
          <h2>Browser storage</h2>
          <p>Some tools save small preferences locally, such as recently opened tools or a game score. This information stays in the browser on your device. You can remove it by clearing this site&apos;s browser storage.</p>
        </section>
        <section>
          <h2>Tool inputs</h2>
          <p>Most inputs stay local. A tool that needs a remote request should make that clear in its interface. For example, the temporary paste tool sends the text you choose to share to the Kaya API so it can be shown through the generated link.</p>
        </section>
        <section>
          <h2>Temporary paste service</h2>
          <p>Temporary pastes are readable by anyone with their link until their selected expiry time. The content, code, creation time, and expiry time are stored only to serve the link and then are automatically deleted. Do not share passwords, private keys, tokens, or sensitive personal information through this service.</p>
        </section>
        <section>
          <h2>External links</h2>
          <p>Links to GitHub, references, and other third-party services are governed by their own privacy policies once you leave Kaya.</p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>For privacy questions, email <a href="mailto:kayaweb3@gmail.com">kayaweb3@gmail.com</a>.</p>
        </section>
      </article>

      <div className="policy-links">
        <Link href="/tools" className="text-link">Browse tools</Link>
        <Link href="/" className="text-link">Home</Link>
      </div>
    </main>
  );
}
