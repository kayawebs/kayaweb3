"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "into", "your", "are", "you", "have", "will", "not",
  "tool", "tools", "into", "than", "they", "their", "about", "when", "what", "which", "where", "been",
]);

const TEXT = {
  en: {
    command: "extract keywords",
    input: "Text input",
    output: "Top keywords",
    empty: "Enter some text to extract keywords from.",
    example:
      "Bitcoin fee estimation depends on virtual size, input type, output type, and the selected satoshi per vbyte target fee rate.",
  },
  zh: {
    command: "extract keywords",
    input: "文本输入",
    output: "关键词结果",
    empty: "请输入需要提取关键词的文本。",
    example:
      "Bitcoin 手续费估算通常取决于 virtual size、输入类型、输出类型，以及选择的 satoshi per vbyte 目标费率。",
  },
} as const;

function extractKeywords(input: string) {
  const words = input
    .toLowerCase()
    .match(/[a-z0-9]{3,}/g) ?? [];

  const counts = new Map<string, number>();
  for (const word of words) {
    if (STOP_WORDS.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 12)
    .map(([word, count]) => `${word} (${count})`)
    .join("\n");
}

export default function KeywordExtractorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);

  const result = useMemo(() => {
    if (!input.trim()) return { error: text.empty };
    return { output: extractKeywords(input) };
  }, [input, text.empty]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/keyword-extractor</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="keyword-extractor-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="keyword-extractor-input" value={input} onChange={(event) => setInput(event.target.value)} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.output}</div>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <textarea readOnly value={result.output} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
