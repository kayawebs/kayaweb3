"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "jq paths",
    input: "JSON input",
    output: "Flattened JSON",
    invalid: "Enter valid JSON to flatten.",
    example: '{\n  "user": {\n    "name": "kaya",\n    "roles": ["dev", "writer"]\n  }\n}',
  },
  zh: {
    command: "jq paths",
    input: "JSON 输入",
    output: "扁平化结果",
    invalid: "请输入有效的 JSON 后再扁平化。",
    example: '{\n  "user": {\n    "name": "kaya",\n    "roles": ["dev", "writer"]\n  }\n}',
  },
} as const;

function flattenJson(value: unknown, prefix = "", output: Record<string, unknown> = {}) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      flattenJson(item, `${prefix}[${index}]`, output);
    });
    if (value.length === 0 && prefix) output[prefix] = [];
    return output;
  }

  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    entries.forEach(([key, item]) => {
      const next = prefix ? `${prefix}.${key}` : key;
      flattenJson(item, next, output);
    });
    if (entries.length === 0 && prefix) output[prefix] = {};
    return output;
  }

  output[prefix || "$"] = value;
  return output;
}

export default function JsonFlattenTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);

  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      return { output: JSON.stringify(flattenJson(parsed), null, 2) };
    } catch {
      return { error: text.invalid };
    }
  }, [input, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/json-flatten-tool</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="json-flatten-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="json-flatten-input" value={input} onChange={(event) => setInput(event.target.value)} rows={16} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="json-flatten-output" className="block text-sm font-medium">{text.output}</label>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <textarea id="json-flatten-output" readOnly value={result.output} rows={16} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
