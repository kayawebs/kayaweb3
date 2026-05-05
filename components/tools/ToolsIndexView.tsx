"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { readRecentToolSlugs } from "@/components/tools/recent-tools";
import ToolLocaleSwitcher from "@/components/tools/ToolLocaleSwitcher";
import { getLocalizedTool, getLocalizedToolCollection, getToolPath, getToolUiText, type ToolLocale } from "@/lib/tool-i18n";

type ToolsIndexViewProps = {
  locale: ToolLocale;
};

export default function ToolsIndexView({ locale }: ToolsIndexViewProps) {
  const baseSections = getLocalizedToolCollection(locale);
  const ui = getToolUiText(locale);
  const [recentSlugs] = useState<string[]>(() => readRecentToolSlugs());
  const sections = useMemo(() => {
    const recentItems = recentSlugs
      .map((slug) => getLocalizedTool(slug, locale))
      .filter((item): item is NonNullable<ReturnType<typeof getLocalizedTool>> => Boolean(item));

    if (recentItems.length === 0) {
      return baseSections;
    }

    return [
      {
        key: "recent",
        title: ui.recentTitle,
        description: ui.recentDescription,
        count: recentItems.length,
        items: recentItems,
      },
      ...baseSections,
    ];
  }, [baseSections, locale, recentSlugs, ui.recentDescription, ui.recentTitle]);
  const [activeCategory, setActiveCategory] = useState<string>(() => (recentSlugs.length > 0 ? "recent" : baseSections[0]?.key ?? ""));

  useEffect(() => {
    const sectionElements = sections
      .map((section) => document.getElementById(section.key))
      .filter((element): element is HTMLElement => Boolean(element));

    if (sectionElements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries[0]?.target.id) {
          setActiveCategory(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -55% 0px",
        threshold: [0.15, 0.35, 0.6],
      },
    );

    sectionElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 pb-16 pt-12 sm:px-10 sm:pt-16">
        <div className="relative">
          <section className="terminal-panel space-y-5">
            <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
              <span className="terminal-accent">~/tools</span>
              <span>{ui.indexCommand}</span>
            </div>
            <header className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">{ui.indexH1}</h1>
                <ToolLocaleSwitcher locale={locale} />
              </div>
              <p className="max-w-3xl text-sm leading-6 text-[var(--foreground)]/85">{ui.indexIntro}</p>
            </header>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 min-[1680px]:hidden">
              {sections.map((category) => (
                <a
                  key={category.key}
                  href={`#${category.key}`}
                  aria-current={activeCategory === category.key ? "true" : undefined}
                  className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 px-4 py-3 transition-colors hover:border-[var(--terminal-accent)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold">{category.title}</span>
                    <span className="text-xs font-mono text-[var(--terminal-muted)]">{category.count}</span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[var(--terminal-muted)]">{category.description}</p>
                </a>
              ))}
            </div>
          </section>

          <aside className="absolute left-[calc(100%+1.5rem)] top-0 hidden h-full w-56 min-[1680px]:block">
            <div className="sticky top-0 space-y-3 rounded-xl border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/78 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--terminal-border)] px-1 pb-2 text-xs font-mono text-[var(--terminal-muted)]">
                <span className="terminal-accent">~/tools/nav</span>
                <span>{sections.length}</span>
              </div>
              <nav aria-label="Tool categories" className="space-y-2">
                {sections.map((category) => (
                  <a
                    key={category.key}
                    href={`#${category.key}`}
                    aria-current={activeCategory === category.key ? "true" : undefined}
                    className={`block rounded-lg border px-3 py-2 transition-colors ${
                      activeCategory === category.key
                        ? "border-[var(--terminal-accent)] bg-[var(--terminal-panel-bg)]/70 shadow-[inset_0_0_0_1px_rgba(159,255,224,0.15)]"
                        : "border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/25 hover:border-[var(--terminal-accent)] hover:bg-[var(--terminal-panel-bg)]/55"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-semibold leading-5 ${activeCategory === category.key ? "text-[var(--terminal-accent)]" : ""}`}>{category.title}</span>
                      <span className="shrink-0 text-[11px] font-mono text-[var(--terminal-muted)]">{category.count}</span>
                    </div>
                    <p className="mt-1 text-[11px] leading-5 text-[var(--terminal-muted)]">{category.description}</p>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="mt-8 space-y-6">
            {sections.map((category) => (
              <section key={category.key} id={category.key} className="terminal-panel space-y-4 scroll-mt-24">
                <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
                  <span className="terminal-accent">~/tools/{category.key}</span>
                  <span>
                    {category.count} {ui.entries}
                  </span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold tracking-tight">{category.title}</h2>
                  <p className="text-sm text-[var(--terminal-muted)]">{category.description}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {category.items.map((tool) => {
                    if (!tool) return null;

                    return (
                      <Link
                        key={tool.slug}
                        href={getToolPath(locale, tool.slug)}
                        className="group rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 px-3 py-3 transition-colors hover:border-[var(--terminal-accent)] hover:bg-[var(--terminal-panel-bg)]/60"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-sm font-semibold leading-5 text-[var(--foreground)]">{tool.name}</h3>
                          <span
                            className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-mono ${
                              tool.status === "ready"
                                ? "border border-green-500/40 text-green-400"
                                : "border border-[var(--terminal-border)] text-[var(--terminal-muted)]"
                            }`}
                          >
                            {tool.status === "ready" ? ui.statusLive : ui.statusPlanned}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-[var(--terminal-muted)]">{tool.summary}</p>
                        <div className="mt-3 text-[11px] font-mono text-[var(--terminal-accent)] group-hover:text-[var(--foreground)]">
                          {getToolPath(locale, tool.slug)}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
