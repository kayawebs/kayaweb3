import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Kaya",
  description: "Privacy policy for Kaya blog and tools, including analytics and browser-side storage usage.",
};

const updatedAt = "2026-05-05";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 pb-16 pt-12 sm:px-10 sm:pt-16">
        <section className="terminal-panel space-y-5">
          <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
            <span className="terminal-accent">~/privacy</span>
            <span>cat policy.md</span>
          </div>
          <header className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight">Privacy Policy</h1>
            <p className="text-sm text-[var(--foreground)]/85">
              This page explains what Kaya collects, what stays in your browser, and how analytics works on the site.
            </p>
            <p className="text-xs font-mono text-[var(--terminal-muted)]">Last updated: {updatedAt}</p>
          </header>
        </section>

        <section className="terminal-panel space-y-6 text-sm leading-7 text-[var(--foreground)]/90">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold tracking-tight">1. Scope</h2>
            <p>
              This website includes Kaya&apos;s blog, search pages, and browser-based tools. Most tools run fully on the client side and do not require you to create an account or submit personal data to a backend.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold tracking-tight">2. Analytics</h2>
            <p>
              This site uses Vercel Web Analytics to measure page views, traffic sources, and high-level usage trends. The goal is to understand which pages and tools are useful, improve content quality, and maintain site performance.
            </p>
            <p>
              Vercel Analytics may process technical request data such as page path, referrer, browser, device class, and country-level location for aggregate reporting.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold tracking-tight">3. Browser Storage</h2>
            <p>
              Some tools store small pieces of local state directly in your browser. For example, the tools index can remember recently opened tools using <code>localStorage</code>. This data stays on your device.
            </p>
            <p>You can clear this data at any time by clearing your browser storage for this site.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold tracking-tight">4. Tool Inputs</h2>
            <p>
              Most tool inputs are processed locally in the browser. If a specific tool needs a remote request, that should be evident from the tool itself, such as asking for an RPC endpoint or external URL.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold tracking-tight">5. Third-Party Links</h2>
            <p>
              The site may link to GitHub, external projects, reference sites, or other third-party resources. Once you leave this site, their own privacy policies apply.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold tracking-tight">6. Contact</h2>
            <p>
              If you have privacy questions about this site, contact{" "}
              <a href="mailto:kayaweb3@gmail.com" className="underline underline-offset-2">
                kayaweb3@gmail.com
              </a>
              .
            </p>
          </div>

          <div className="border-t border-[var(--terminal-border)] pt-4 text-xs font-mono text-[var(--terminal-muted)]">
            <Link href="/tools" className="terminal-accent underline-offset-2 hover:underline">
              /tools
            </Link>
            <span> · </span>
            <Link href="/" className="terminal-accent underline-offset-2 hover:underline">
              /
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
