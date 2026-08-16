import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} Kaya. Notes, tools, and small experiments.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-[var(--foreground)]">Privacy</Link>
          <a href="mailto:kayaweb3@gmail.com" className="hover:text-[var(--foreground)]">Contact</a>
        </div>
      </div>
    </footer>
  );
}
