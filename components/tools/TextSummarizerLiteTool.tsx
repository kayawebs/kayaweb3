"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "summarize text",
    input: "Text input",
    output: "Summary",
    empty: "Enter some text to summarize.",
    example:
      "Kaya Tools is a growing collection of static utilities focused on SEO, developer workflows, Web3 analysis, and small practical helpers. Each tool page is designed to load fast, work in the browser, and include structured metadata for discoverability.",
  },
  zh: {
    command: "summarize text",
    input: "文本输入",
    output: "摘要结果",
    empty: "请输入需要总结的文本。",
    example:
      "Kaya Tools 是一组持续扩展的静态工具集合，主要面向 SEO、开发工作流、Web3 分析和一些小而实用的场景。每个工具页都尽量保证加载快、浏览器内可用，并带有结构化 metadata 以提升可发现性。",
  },
} as const;

function summarizeText(input: string) {
  const sentences = input
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?。！？])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (!sentences.length) return "";
  if (sentences.length === 1) return sentences[0];
  if (sentences.length === 2) return `${sentences[0]} ${sentences[1]}`;
  return `${sentences[0]} ${sentences[Math.min(1, sentences.length - 1)]}`;
}

export default function TextSummarizerLiteTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);

  const result = useMemo(() => {
    if (!input.trim()) return { error: text.empty };
    return { output: summarizeText(input) };
  }, [input, text.empty]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/text-summarizer-lite</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="text-summarizer-lite-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="text-summarizer-lite-input" value={input} onChange={(event) => setInput(event.target.value)} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.output}</div>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <textarea readOnly value={result.output} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
