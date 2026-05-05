"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "format prompt",
    input: "Prompt input",
    output: "Formatted prompt",
    invalid: "Enter prompt content to format.",
    example:
      "Write a product announcement email. audience: crypto developers tone: concise include: launch date, key features, CTA",
  },
  zh: {
    command: "format prompt",
    input: "Prompt 输入",
    output: "整理后提示词",
    invalid: "请输入需要整理的 prompt 内容。",
    example:
      "写一封产品发布邮件 audience: crypto developers tone: concise include: launch date, key features, CTA",
  },
} as const;

function formatPrompt(input: string) {
  const cleaned = input
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const lines = cleaned
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const keyValueLines: string[] = [];
  const freeformLines: string[] = [];

  for (const line of lines) {
    if (/^[a-zA-Z][a-zA-Z0-9 _-]{1,30}:\s+.+$/.test(line)) {
      const [label, ...rest] = line.split(":");
      keyValueLines.push(`${label.trim()}: ${rest.join(":").trim()}`);
      continue;
    }

    const inlineSections = line.split(/\s+(?=[a-zA-Z][a-zA-Z0-9 _-]{1,20}:)/g);
    if (inlineSections.length > 1) {
      freeformLines.push(inlineSections[0].trim());
      for (const section of inlineSections.slice(1)) {
        keyValueLines.push(section.trim().replace(/\s*:\s*/g, ": "));
      }
    } else {
      freeformLines.push(line);
    }
  }

  const parts: string[] = [];
  if (freeformLines.length) {
    parts.push(freeformLines.join("\n"));
  }
  if (keyValueLines.length) {
    parts.push(keyValueLines.join("\n"));
  }

  return parts.join("\n\n");
}

export default function PromptFormatterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);

  const result = useMemo(() => {
    if (!input.trim()) return { error: text.invalid };
    return { output: formatPrompt(input) };
  }, [input, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/prompt-formatter</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="prompt-formatter-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="prompt-formatter-input" value={input} onChange={(event) => setInput(event.target.value)} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="prompt-formatter-output" className="block text-sm font-medium">{text.output}</label>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <textarea id="prompt-formatter-output" readOnly value={result.output} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
