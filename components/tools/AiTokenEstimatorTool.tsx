"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "rough token estimate",
    input: "Text input",
    chars: "Characters",
    words: "Words",
    lines: "Lines",
    tokens: "Estimated tokens",
    note: "Approximation based on text length and whitespace patterns, useful for planning not billing.",
    example: "You are a concise assistant. Summarize the following meeting notes and extract action items.",
  },
  zh: {
    command: "rough token estimate",
    input: "文本输入",
    chars: "字符数",
    words: "单词数",
    lines: "行数",
    tokens: "预估 tokens",
    note: "这是基于文本长度和空白分布的近似估算，适合做规划，不适合当作精确计费依据。",
    example: "你是一个简洁的助手。请总结以下会议记录，并提取行动项。",
  },
} as const;

function estimateTokens(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return 0;
  const chars = trimmed.length;
  const words = trimmed.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(chars / 4 + words * 0.15));
}

export default function AiTokenEstimatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);

  const stats = useMemo(() => {
    const chars = input.length;
    const words = input.trim() ? input.trim().split(/\s+/).filter(Boolean).length : 0;
    const lines = input ? input.split("\n").length : 0;
    const tokens = estimateTokens(input);
    return { chars, words, lines, tokens };
  }, [input]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/ai-token-estimator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="ai-token-estimator-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="ai-token-estimator-input" value={input} onChange={(event) => setInput(event.target.value)} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
              <div className="text-sm font-medium">{text.chars}</div>
              <div className="mt-2 font-mono text-2xl">{stats.chars}</div>
            </div>
            <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
              <div className="text-sm font-medium">{text.words}</div>
              <div className="mt-2 font-mono text-2xl">{stats.words}</div>
            </div>
            <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
              <div className="text-sm font-medium">{text.lines}</div>
              <div className="mt-2 font-mono text-2xl">{stats.lines}</div>
            </div>
            <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
              <div className="text-sm font-medium">{text.tokens}</div>
              <div className="mt-2 font-mono text-2xl text-[var(--terminal-accent)]">{stats.tokens}</div>
            </div>
          </div>
          <p className="text-sm leading-6 text-[var(--foreground)]/75">{text.note}</p>
        </div>
      </div>
    </section>
  );
}
