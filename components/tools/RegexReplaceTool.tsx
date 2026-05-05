"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "sed",
    pattern: "Pattern",
    flags: "Flags",
    replacement: "Replacement",
    input: "Source text",
    output: "Replaced text",
    invalid: "Invalid regular expression.",
    examplePattern: "\\s+",
    exampleFlags: "g",
    exampleReplacement: "-",
    exampleInput: "kaya tools page",
  },
  zh: {
    command: "sed",
    pattern: "表达式",
    flags: "标记",
    replacement: "替换内容",
    input: "原始文本",
    output: "替换结果",
    invalid: "正则表达式无效。",
    examplePattern: "\\s+",
    exampleFlags: "g",
    exampleReplacement: "-",
    exampleInput: "kaya tools page",
  },
} as const;

export default function RegexReplaceTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [pattern, setPattern] = useState<string>(text.examplePattern);
  const [flags, setFlags] = useState<string>(text.exampleFlags);
  const [replacement, setReplacement] = useState<string>(text.exampleReplacement);
  const [input, setInput] = useState<string>(text.exampleInput);

  const result = useMemo(() => {
    try {
      const normalizedFlags = Array.from(new Set(flags.replace(/[^dgimsuvy]/g, "").split(""))).join("");
      const regex = new RegExp(pattern, normalizedFlags);
      return { output: input.replace(regex, replacement) };
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) };
    }
  }, [flags, input, pattern, replacement]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/regex-replace-tool</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_140px]">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <span className="block text-sm font-medium">{text.pattern}</span>
          <input value={pattern} onChange={(event) => setPattern(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <span className="block text-sm font-medium">{text.flags}</span>
          <input value={flags} onChange={(event) => setFlags(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </label>
      </div>
      <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <label htmlFor="regex-replace-replacement" className="block text-sm font-medium">{text.replacement}</label>
        <input id="regex-replace-replacement" value={replacement} onChange={(event) => setReplacement(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="regex-replace-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="regex-replace-input" value={input} onChange={(event) => setInput(event.target.value)} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="regex-replace-output" className="block text-sm font-medium">{text.output}</label>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{text.invalid} {result.error}</p>
          ) : (
            <textarea id="regex-replace-output" readOnly value={result.output} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
