"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "wc",
    input: "Text input",
    words: "words",
    characters: "characters",
    noSpaces: "characters (no spaces)",
    lines: "lines",
    paragraphs: "paragraphs",
  },
  zh: {
    command: "wc",
    input: "文本输入",
    words: "单词数",
    characters: "字符数",
    noSpaces: "字符数（不含空格）",
    lines: "行数",
    paragraphs: "段落数",
  },
} as const;

export default function WordCharacterCounterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>("Hello Kaya\n\nThis is a tools page.");

  const result = useMemo(() => {
    const trimmed = input.trim();
    return {
      words: trimmed ? trimmed.split(/\s+/).length : 0,
      characters: input.length,
      noSpaces: input.replace(/\s/g, "").length,
      lines: input ? input.split(/\r?\n/).length : 0,
      paragraphs: trimmed ? trimmed.split(/\n\s*\n/).length : 0,
    };
  }, [input]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/word-character-counter</span>
        <span>{text.command}</span>
      </div>
      <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <label htmlFor="word-counter-input" className="block text-sm font-medium">{text.input}</label>
        <textarea id="word-counter-input" value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.words}</div><div className="mt-1 font-mono text-lg">{result.words}</div></div>
        <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.characters}</div><div className="mt-1 font-mono text-lg">{result.characters}</div></div>
        <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.noSpaces}</div><div className="mt-1 font-mono text-lg">{result.noSpaces}</div></div>
        <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.lines}</div><div className="mt-1 font-mono text-lg">{result.lines}</div></div>
        <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.paragraphs}</div><div className="mt-1 font-mono text-lg">{result.paragraphs}</div></div>
      </div>
    </section>
  );
}
