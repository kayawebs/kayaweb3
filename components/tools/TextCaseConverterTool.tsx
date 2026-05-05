"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

function toTitleCase(value: string) {
  return value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function toSentenceCase(value: string) {
  const lower = value.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function toSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const TEXT = {
  en: {
    command: "tr",
    input: "Text input",
    lower: "lowercase",
    upper: "UPPERCASE",
    title: "Title Case",
    sentence: "Sentence case",
    slug: "slug-case",
  },
  zh: {
    command: "tr",
    input: "文本输入",
    lower: "小写",
    upper: "大写",
    title: "标题式",
    sentence: "句首大写",
    slug: "slug 风格",
  },
} as const;

export default function TextCaseConverterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>("Hello Kaya Tools");

  const result = useMemo(() => ({
    lower: input.toLowerCase(),
    upper: input.toUpperCase(),
    title: toTitleCase(input),
    sentence: toSentenceCase(input),
    slug: toSlug(input),
  }), [input]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/text-case-converter</span>
        <span>{text.command}</span>
      </div>
      <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <label htmlFor="case-converter-input" className="block text-sm font-medium">{text.input}</label>
        <textarea id="case-converter-input" value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.lower}</div><div className="mt-1 break-all text-sm">{result.lower}</div></div>
        <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.upper}</div><div className="mt-1 break-all text-sm">{result.upper}</div></div>
        <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.title}</div><div className="mt-1 break-all text-sm">{result.title}</div></div>
        <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.sentence}</div><div className="mt-1 break-all text-sm">{result.sentence}</div></div>
        <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.slug}</div><div className="mt-1 break-all font-mono text-sm">{result.slug}</div></div>
      </div>
    </section>
  );
}
