"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Home", compact: true },
  { href: "/blog", label: "Journal" },
  { href: "/tools", label: "Tools" },
  { href: "/tools/paste", label: "Paste" },
  { href: "/search", label: "Search", compact: true },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-brand" aria-label="Kaya home">
          <span className="site-brand-mark">K</span>
          <span className="site-brand-name">Kaya</span>
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-active={isActive(pathname, item.href) || undefined}
              data-compact={item.compact || undefined}
              className="site-nav-link"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
