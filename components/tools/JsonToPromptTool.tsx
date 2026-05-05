"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "json -> prompt",
    input: "JSON input",
    output: "Prompt output",
    invalid: "Enter valid JSON to turn into a prompt.",
    example: '{\n  "task": "Write a launch post",\n  "audience": "web3 developers",\n  "tone": "concise",\n  "include": ["release date", "main features", "CTA"]\n}',
  },
  zh: {
    command: "json -> prompt",
    input: "JSON 输入",
    output: "Prompt 结果",
    invalid: "请输入有效的 JSON 后再转换为 prompt。",
    example: '{\n  "task": "写一篇发布帖",\n  "audience": "web3 developers",\n  "tone": "concise",\n  "include": ["release date", "main features", "CTA"]\n}',
  },
} as const;

function valueToPrompt(value: unknown, indent = 0): string[] {
  const prefix = "  ".repeat(indent);

  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (typeof item === "object" && item !== null) {
        return [`${prefix}-`, ...valueToPrompt(item, indent + 1)];
      }
      return [`${prefix}- ${String(item)}`];
    });
  }

  if (typeof value === "object" && value !== null) {
    return Object.entries(value).flatMap(([key, nested]) => {
      if (Array.isArray(nested)) {
        return [`${prefix}${key}:`, ...valueToPrompt(nested, indent + 1)];
      }
      if (typeof nested === "object" && nested !== null) {
        return [`${prefix}${key}:`, ...valueToPrompt(nested, indent + 1)];
      }
      return [`${prefix}${key}: ${String(nested)}`];
    });
  }

  return [`${prefix}${String(value)}`];
}

export default function JsonToPromptTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);

  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      return { output: valueToPrompt(parsed).join("\n") };
    } catch {
      return { error: text.invalid };
    }
  }, [input, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/json-to-prompt</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="json-to-prompt-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="json-to-prompt-input" value={input} onChange={(event) => setInput(event.target.value)} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="json-to-prompt-output" className="block text-sm font-medium">{text.output}</label>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <textarea id="json-to-prompt-output" readOnly value={result.output} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
