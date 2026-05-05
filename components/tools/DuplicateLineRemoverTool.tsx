"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "uniq",
    input: "Text input",
    output: "Deduplicated output",
    preserveCase: "Case-sensitive",
    trimWhitespace: "Trim line edges",
    keepEmpty: "Keep empty lines",
    summary: "Summary",
    total: "Total lines",
    unique: "Unique lines",
    removed: "Removed duplicates",
    example: "apple\nbanana\napple\n Banana \nbanana\n",
  },
  zh: {
    command: "uniq",
    input: "文本输入",
    output: "去重结果",
    preserveCase: "区分大小写",
    trimWhitespace: "裁剪行首尾空白",
    keepEmpty: "保留空行",
    summary: "统计",
    total: "总行数",
    unique: "唯一行数",
    removed: "移除重复数",
    example: "apple\nbanana\napple\n Banana \nbanana\n",
  },
} as const;

export default function DuplicateLineRemoverTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);
  const [preserveCase, setPreserveCase] = useState(true);
  const [trimWhitespace, setTrimWhitespace] = useState(false);
  const [keepEmpty, setKeepEmpty] = useState(true);

  const result = useMemo(() => {
    const lines = input.split(/\r?\n/);
    const seen = new Set<string>();
    const output: string[] = [];
    let removed = 0;

    for (const line of lines) {
      const normalized = trimWhitespace ? line.trim() : line;
      if (!keepEmpty && normalized.length === 0) {
        continue;
      }

      const key = preserveCase ? normalized : normalized.toLowerCase();
      if (seen.has(key)) {
        removed += 1;
        continue;
      }

      seen.add(key);
      output.push(trimWhitespace ? normalized : line);
    }

    return {
      output: output.join("\n"),
      total: lines.length,
      unique: output.length,
      removed,
    };
  }, [input, keepEmpty, preserveCase, trimWhitespace]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/duplicate-line-remover</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex items-center gap-2 rounded border border-[var(--terminal-border)] px-3 py-2 text-sm">
          <input type="checkbox" checked={preserveCase} onChange={(event) => setPreserveCase(event.target.checked)} />
          <span>{text.preserveCase}</span>
        </label>
        <label className="flex items-center gap-2 rounded border border-[var(--terminal-border)] px-3 py-2 text-sm">
          <input type="checkbox" checked={trimWhitespace} onChange={(event) => setTrimWhitespace(event.target.checked)} />
          <span>{text.trimWhitespace}</span>
        </label>
        <label className="flex items-center gap-2 rounded border border-[var(--terminal-border)] px-3 py-2 text-sm">
          <input type="checkbox" checked={keepEmpty} onChange={(event) => setKeepEmpty(event.target.checked)} />
          <span>{text.keepEmpty}</span>
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="duplicate-line-remover-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="duplicate-line-remover-input" value={input} onChange={(event) => setInput(event.target.value)} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="duplicate-line-remover-output" className="block text-sm font-medium">{text.output}</label>
          <textarea id="duplicate-line-remover-output" readOnly value={result.output} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
        </div>
      </div>

      <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
        <div className="mb-3 text-xs font-mono text-[var(--terminal-muted)]">{text.summary}</div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.total}</div>
            <div className="mt-1 text-lg font-semibold">{result.total}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.unique}</div>
            <div className="mt-1 text-lg font-semibold">{result.unique}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.removed}</div>
            <div className="mt-1 text-lg font-semibold">{result.removed}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
