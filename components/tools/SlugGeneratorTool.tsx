"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

function toSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const TEXT = {
  en: {
    command: "slugify",
    input: "Text input",
    output: "Slug output",
  },
  zh: {
    command: "slugify",
    input: "文本输入",
    output: "Slug 结果",
  },
} as const;

export default function SlugGeneratorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>("Hello Kaya Tools: JSON & Web3");
  const result = useMemo(() => toSlug(input), [input]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/slug-generator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="slug-generator-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="slug-generator-input" value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="slug-generator-output" className="block text-sm font-medium">{text.output}</label>
          <textarea id="slug-generator-output" readOnly value={result} rows={8} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
        </div>
      </div>
    </section>
  );
}
