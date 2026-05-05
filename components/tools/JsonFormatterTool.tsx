"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "jq .",
    input: "JSON input",
    output: "Formatted JSON",
    invalid: "Enter valid JSON to format.",
    example: '{\n  "name":"kaya",\n  "tools":["json","base64"]\n}',
  },
  zh: {
    command: "jq .",
    input: "JSON 输入",
    output: "格式化结果",
    invalid: "请输入有效的 JSON 后再格式化。",
    example: '{\n  "name":"kaya",\n  "tools":["json","base64"]\n}',
  },
} as const;

export default function JsonFormatterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);

  const result = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return { error: text.invalid };
    try {
      const parsed = JSON.parse(trimmed);
      return { output: JSON.stringify(parsed, null, 2) };
    } catch {
      return { error: text.invalid };
    }
  }, [input, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/json-formatter</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="json-formatter-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="json-formatter-input" value={input} onChange={(event) => setInput(event.target.value)} rows={16} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="json-formatter-output" className="block text-sm font-medium">{text.output}</label>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <textarea id="json-formatter-output" readOnly value={result.output} rows={16} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
