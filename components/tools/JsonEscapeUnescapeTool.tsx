"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "JSON.stringify",
    input: "Text / JSON string input",
    escape: "escape",
    unescape: "unescape",
    output: "Output",
    invalid: "Enter a valid JSON string value to unescape.",
  },
  zh: {
    command: "JSON.stringify",
    input: "文本 / JSON 字符串输入",
    escape: "转义",
    unescape: "还原",
    output: "结果",
    invalid: "请输入合法的 JSON 字符串字面量后再还原。",
  },
} as const;

export default function JsonEscapeUnescapeTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>('hello "kaya"\nnext line');
  const [mode, setMode] = useState<"escape" | "unescape">("escape");

  const result = useMemo(() => {
    try {
      if (mode === "escape") return { output: JSON.stringify(input) };
      const parsed = JSON.parse(input);
      if (typeof parsed !== "string") return { error: text.invalid };
      return { output: parsed };
    } catch {
      return { error: text.invalid };
    }
  }, [input, mode, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/json-escape-unescape</span>
        <span>{text.command}</span>
      </div>
      <div className="flex flex-wrap gap-2 text-xs font-mono">
        <button type="button" onClick={() => setMode("escape")} className={`rounded border px-2 py-1 ${mode === "escape" ? "border-[var(--terminal-accent)] text-[var(--terminal-accent)]" : "border-[var(--terminal-border)]"}`}>{text.escape}</button>
        <button type="button" onClick={() => setMode("unescape")} className={`rounded border px-2 py-1 ${mode === "unescape" ? "border-[var(--terminal-accent)] text-[var(--terminal-accent)]" : "border-[var(--terminal-border)]"}`}>{text.unescape}</button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="json-escape-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="json-escape-input" value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="json-escape-output" className="block text-sm font-medium">{text.output}</label>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <textarea id="json-escape-output" readOnly value={result.output} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
