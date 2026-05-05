"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "jq | csv",
    input: "JSON input",
    output: "CSV output",
    invalid: "Enter valid JSON in object or array form.",
    example: `[
  { "name": "Kaya", "role": "dev", "active": true },
  { "name": "Milo", "role": "writer", "active": false }
]`,
  },
  zh: {
    command: "jq | csv",
    input: "JSON 输入",
    output: "CSV 输出",
    invalid: "请输入合法的 JSON，且结构为对象或数组。",
    example: `[
  { "name": "Kaya", "role": "dev", "active": true },
  { "name": "Milo", "role": "writer", "active": false }
]`,
  },
} as const;

function flattenRow(value: unknown, prefix = "", output: Record<string, unknown> = {}) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      flattenRow(item, `${prefix}[${index}]`, output);
    });
    if (value.length === 0 && prefix) output[prefix] = "";
    return output;
  }

  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    entries.forEach(([key, item]) => {
      const next = prefix ? `${prefix}.${key}` : key;
      flattenRow(item, next, output);
    });
    if (entries.length === 0 && prefix) output[prefix] = "";
    return output;
  }

  output[prefix || "value"] = value ?? "";
  return output;
}

function csvEscape(value: unknown) {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, "\"\"")}"` : text;
}

export default function JsonToCsvConverterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);

  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      const rows = Array.isArray(parsed) ? parsed : [parsed];
      if (!rows.every((row) => row !== null && typeof row === "object")) {
        return { error: text.invalid };
      }

      const flatRows = rows.map((row) => flattenRow(row));
      const headers = Array.from(new Set(flatRows.flatMap((row) => Object.keys(row))));
      const csvLines = [
        headers.map(csvEscape).join(","),
        ...flatRows.map((row) => headers.map((header) => csvEscape(row[header] ?? "")).join(",")),
      ];

      return { output: csvLines.join("\n") };
    } catch {
      return { error: text.invalid };
    }
  }, [input, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/json-to-csv-converter</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="json-to-csv-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="json-to-csv-input" value={input} onChange={(event) => setInput(event.target.value)} rows={16} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="json-to-csv-output" className="block text-sm font-medium">{text.output}</label>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <textarea id="json-to-csv-output" readOnly value={result.output} rows={16} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
