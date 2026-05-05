"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "jq empty",
    input: "JSON input",
    valid: "valid JSON",
    invalid: "invalid JSON",
    parsedType: "parsed type",
    error: "parse error",
    example: '{"name":"kaya","count":2}',
  },
  zh: {
    command: "jq empty",
    input: "JSON 输入",
    valid: "合法 JSON",
    invalid: "非法 JSON",
    parsedType: "解析类型",
    error: "解析错误",
    example: '{"name":"kaya","count":2}',
  },
} as const;

export default function JsonValidatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);

  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      const type = Array.isArray(parsed) ? "array" : parsed === null ? "null" : typeof parsed;
      return { valid: true, type };
    } catch (error) {
      return { valid: false, message: error instanceof Error ? error.message : String(error) };
    }
  }, [input]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/json-validator</span>
        <span>{text.command}</span>
      </div>
      <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <label htmlFor="json-validator-input" className="block text-sm font-medium">{text.input}</label>
        <textarea id="json-validator-input" value={input} onChange={(event) => setInput(event.target.value)} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded border border-[var(--terminal-border)] p-3">
          <div className="text-xs font-mono text-[var(--terminal-muted)]">{result.valid ? text.valid : text.invalid}</div>
          <div className={`mt-1 text-sm ${result.valid ? "text-green-400" : "text-amber-300"}`}>{result.valid ? text.valid : text.invalid}</div>
        </div>
        <div className="rounded border border-[var(--terminal-border)] p-3">
          <div className="text-xs font-mono text-[var(--terminal-muted)]">{result.valid ? text.parsedType : text.error}</div>
          <div className="mt-1 break-all font-mono text-sm">{result.valid ? result.type : result.message}</div>
        </div>
      </div>
    </section>
  );
}
