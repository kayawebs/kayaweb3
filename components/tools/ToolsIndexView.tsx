"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { readRecentToolSlugs } from "@/components/tools/recent-tools";
import ToolLocaleSwitcher from "@/components/tools/ToolLocaleSwitcher";
import { getLocalizedTool, getLocalizedToolCollection, getToolPath, type ToolLocale } from "@/lib/tool-i18n";
import type { ToolCategoryKey, ToolDefinition } from "@/lib/tools";

type ToolsIndexViewProps = {
  locale: ToolLocale;
};

type LocalizedTool = ToolDefinition;

const categoryVisuals: Record<ToolCategoryKey, { symbol: string; tone: string; ink: string }> = {
  web3: { symbol: "◇", tone: "#e7e2ff", ink: "#5c4fc0" },
  ai: { symbol: "✦", tone: "#f8e5cb", ink: "#a85121" },
  "date-time": { symbol: "◷", tone: "#dbeeea", ink: "#04745b" },
  dev: { symbol: "⌘", tone: "#dfe9f7", ink: "#35679d" },
  finance: { symbol: "¤", tone: "#e7efd8", ink: "#557f28" },
  mini: { symbol: "◌", tone: "#f6dfeb", ink: "#9a3f70" },
  "image-file": { symbol: "▧", tone: "#e9e5dc", ink: "#6b6558" },
};

const text = {
  en: {
    eyebrow: "Kaya toolbox",
    title: "Useful work, without the hunt.",
    intro: "A browsable collection of browser-native utilities for developers, chains, files, finance, and everyday work. Most tools run locally. No accounts, no detours.",
    search: "Find a tool: timestamp, JSON, BTC, PDF...",
    all: "All tools",
    recent: "Recently opened",
    recentDescription: "Kept only in this browser.",
    filters: "Collections",
    results: "tools shown",
    available: "Ready",
    planned: "In progress",
    open: "Open tool",
    privacy: "Local-first where possible",
  },
  zh: {
    eyebrow: "Kaya 工具箱",
    title: "找到工具，直接开始做事。",
    intro: "面向开发、链上、文件、金融和日常工作的浏览器工具集合。大部分工具只在本地运行，不需要账号，也不需要绕路。",
    search: "搜索工具：时间戳、JSON、BTC、PDF...",
    all: "全部工具",
    recent: "最近打开",
    recentDescription: "仅保存在当前浏览器中。",
    filters: "工具集合",
    results: "个工具",
    available: "已可用",
    planned: "建设中",
    open: "打开工具",
    privacy: "尽可能在本地完成处理",
  },
} as const;

function toolAction(slug: string, locale: ToolLocale) {
  const en = [
    ["converter", "Convert formats"],
    ["calculator", "Calculate a result"],
    ["generator", "Generate a value"],
    ["formatter", "Clean and format"],
    ["minifier", "Compress input"],
    ["validator", "Validate input"],
    ["checker", "Check validity"],
    ["decoder", "Decode into fields"],
    ["encoder", "Encode a payload"],
    ["parser", "Parse structured data"],
    ["analyzer", "Inspect key signals"],
    ["viewer", "Inspect data"],
    ["estimator", "Estimate an outcome"],
    ["builder", "Build a payload"],
    ["tester", "Run a quick test"],
    ["game", "Play in browser"],
  ] as const;
  const zh = [
    ["converter", "转换格式"],
    ["calculator", "计算结果"],
    ["generator", "生成内容"],
    ["formatter", "整理并格式化"],
    ["minifier", "压缩输入内容"],
    ["validator", "校验输入"],
    ["checker", "检查有效性"],
    ["decoder", "解码为可读字段"],
    ["encoder", "编码数据"],
    ["parser", "解析结构化数据"],
    ["analyzer", "分析关键数据"],
    ["viewer", "查看数据"],
    ["estimator", "估算结果"],
    ["builder", "构建数据"],
    ["tester", "快速测试"],
    ["game", "浏览器小游戏"],
  ] as const;
  const match = (locale === "zh" ? zh : en).find(([needle]) => slug.includes(needle));
  if (match) return match[1];
  if (slug === "paste") return locale === "zh" ? "创建临时分享链接" : "Create a temporary link";
  return locale === "zh" ? "打开并立即使用" : "Open and use instantly";
}

function ToolGlyph({ category }: { category: ToolCategoryKey }) {
  const visual = categoryVisuals[category];
  return (
    <span className="tool-glyph" style={{ "--tool-tone": visual.tone, "--tool-ink": visual.ink } as CSSProperties} aria-hidden="true">
      {visual.symbol}
    </span>
  );
}

function ToolCard({ tool, locale }: { tool: LocalizedTool; locale: ToolLocale }) {
  const visual = categoryVisuals[tool.category];
  const label = text[locale];
  const toolStyle = { "--tool-tone": visual.tone, "--tool-ink": visual.ink } as CSSProperties;

  return (
    <Link href={getToolPath(locale, tool.slug)} className="tool-card" style={toolStyle}>
      <div className="flex items-start justify-between gap-3">
        <ToolGlyph category={tool.category} />
        <span className={`tool-status ${tool.status === "ready" ? "tool-status-ready" : ""}`}>
          {tool.status === "ready" ? label.available : label.planned}
        </span>
      </div>
      <div className="mt-5">
        <h2 className="text-[1rem] font-semibold leading-5 tracking-[-0.025em] text-[var(--foreground)]">{tool.name}</h2>
        <p className="mt-2 text-sm leading-5 text-[var(--muted)]">{toolAction(tool.slug, locale)}</p>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--line)] pt-3">
        <span className="truncate font-mono text-[0.68rem] uppercase tracking-[0.08em] text-[var(--tool-ink)]">{tool.category}</span>
        <span className="tool-open">{label.open} <span aria-hidden="true">↗</span></span>
      </div>
    </Link>
  );
}

export default function ToolsIndexView({ locale }: ToolsIndexViewProps) {
  const sections = getLocalizedToolCollection(locale);
  const labels = text[locale];
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategoryKey | "all">("all");
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  const allTools = useMemo(
    () => sections.flatMap((section) => section.items).filter((tool): tool is LocalizedTool => Boolean(tool)),
    [sections],
  );
  const recentTools = useMemo(
    () => recentSlugs.map((slug) => getLocalizedTool(slug, locale)).filter((tool): tool is LocalizedTool => Boolean(tool)),
    [locale, recentSlugs],
  );
  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return allTools.filter((tool) => {
      const isInCategory = activeCategory === "all" || tool.category === activeCategory;
      const searchTarget = `${tool.name} ${tool.slug} ${tool.summary} ${tool.targetKeyword}`.toLowerCase();
      return isInCategory && (!normalizedQuery || searchTarget.includes(normalizedQuery));
    });
  }, [activeCategory, allTools, query]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setRecentSlugs(readRecentToolSlugs()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <main className="tools-page">
      <section className="tools-hero">
        <div className="max-w-3xl">
          <p className="eyebrow">{labels.eyebrow}</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <h1>{labels.title}</h1>
            <ToolLocaleSwitcher locale={locale} />
          </div>
          <p className="tools-hero-intro">{labels.intro}</p>
        </div>
        <div className="tools-search-shell">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.4" /><path d="m16 16 4.1 4.1" /></svg>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={labels.search} aria-label={labels.search} />
          <span className="hidden font-mono text-[0.68rem] text-[var(--muted)] sm:inline">{filteredTools.length} {labels.results}</span>
        </div>
      </section>

      {recentTools.length > 0 ? (
        <section className="tools-recent">
          <div>
            <p className="eyebrow">{labels.recent}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{labels.recentDescription}</p>
          </div>
          <div className="tools-recent-links">
            {recentTools.slice(0, 5).map((tool) => (
              <Link key={tool.slug} href={getToolPath(locale, tool.slug)} className="recent-tool-link">
                <ToolGlyph category={tool.category} />
                <span>{tool.name}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <div className="tools-catalog-layout">
        <aside className="tools-filter-panel">
          <p className="eyebrow">{labels.filters}</p>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            <button type="button" onClick={() => setActiveCategory("all")} data-active={activeCategory === "all" || undefined} className="collection-filter">
              <span>{labels.all}</span><span>{allTools.length}</span>
            </button>
            {sections.map((section) => (
              <button
                key={section.key}
                type="button"
                onClick={() => setActiveCategory(section.key)}
                data-active={activeCategory === section.key || undefined}
                className="collection-filter"
              >
                <span className="flex items-center gap-2"><ToolGlyph category={section.key} />{section.title}</span>
                <span>{section.count}</span>
              </button>
            ))}
          </div>
          <p className="tools-local-note">{labels.privacy}</p>
        </aside>

        <section aria-live="polite" className="min-w-0">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow">{activeCategory === "all" ? labels.all : sections.find((section) => section.key === activeCategory)?.title}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{filteredTools.length} {labels.results}</p>
            </div>
          </div>
          {filteredTools.length > 0 ? (
            <div className="tool-card-grid">
              {filteredTools.map((tool) => <ToolCard key={tool.slug} tool={tool} locale={locale} />)}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--muted)]">
              {locale === "zh" ? "没有匹配的工具，试试别的关键词。" : "No matching tools. Try another keyword."}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
