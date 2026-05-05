"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "sort",
    input: "Text input",
    output: "Sorted output",
    direction: "Direction",
    ascending: "Ascending",
    descending: "Descending",
    caseSensitive: "Case-sensitive",
    trimWhitespace: "Trim line edges",
    removeEmpty: "Remove empty lines",
    example: "zebra\nAlpha\nbanana\n kiwi \nalpha",
  },
  zh: {
    command: "sort",
    input: "文本输入",
    output: "排序结果",
    direction: "排序方向",
    ascending: "升序",
    descending: "降序",
    caseSensitive: "区分大小写",
    trimWhitespace: "裁剪行首尾空白",
    removeEmpty: "移除空行",
    example: "zebra\nAlpha\nbanana\n kiwi \nalpha",
  },
} as const;

export default function LineSorterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);

  const output = useMemo(() => {
    const collator = new Intl.Collator(undefined, { sensitivity: caseSensitive ? "variant" : "base", numeric: true });
    const sorted = input
      .split(/\r?\n/)
      .map((line) => (trimWhitespace ? line.trim() : line))
      .filter((line) => (removeEmpty ? line.length > 0 : true))
      .sort((a, b) => collator.compare(a, b));

    if (direction === "desc") {
      sorted.reverse();
    }

    return sorted.join("\n");
  }, [caseSensitive, direction, input, removeEmpty, trimWhitespace]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/line-sorter</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,180px))]">
        <div className="rounded border border-[var(--terminal-border)] px-3 py-2 text-sm">
          <div className="mb-2 text-xs font-mono text-[var(--terminal-muted)]">{text.direction}</div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setDirection("asc")} className={`rounded border px-3 py-1.5 text-sm ${direction === "asc" ? "border-[var(--terminal-accent)] text-[var(--terminal-accent)]" : "border-[var(--terminal-border)] text-[var(--foreground)]/80"}`}>{text.ascending}</button>
            <button type="button" onClick={() => setDirection("desc")} className={`rounded border px-3 py-1.5 text-sm ${direction === "desc" ? "border-[var(--terminal-accent)] text-[var(--terminal-accent)]" : "border-[var(--terminal-border)] text-[var(--foreground)]/80"}`}>{text.descending}</button>
          </div>
        </div>
        <label className="flex items-center gap-2 rounded border border-[var(--terminal-border)] px-3 py-2 text-sm">
          <input type="checkbox" checked={caseSensitive} onChange={(event) => setCaseSensitive(event.target.checked)} />
          <span>{text.caseSensitive}</span>
        </label>
        <label className="flex items-center gap-2 rounded border border-[var(--terminal-border)] px-3 py-2 text-sm">
          <input type="checkbox" checked={trimWhitespace} onChange={(event) => setTrimWhitespace(event.target.checked)} />
          <span>{text.trimWhitespace}</span>
        </label>
        <label className="flex items-center gap-2 rounded border border-[var(--terminal-border)] px-3 py-2 text-sm">
          <input type="checkbox" checked={removeEmpty} onChange={(event) => setRemoveEmpty(event.target.checked)} />
          <span>{text.removeEmpty}</span>
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="line-sorter-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="line-sorter-input" value={input} onChange={(event) => setInput(event.target.value)} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="line-sorter-output" className="block text-sm font-medium">{text.output}</label>
          <textarea id="line-sorter-output" readOnly value={output} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
        </div>
      </div>
    </section>
  );
}
