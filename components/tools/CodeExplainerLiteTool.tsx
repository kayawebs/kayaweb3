"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "explain code",
    input: "Code input",
    output: "Explanation",
    example: "function sum(a, b) {\n  return a + b;\n}",
    empty: "Enter some code to explain.",
  },
  zh: {
    command: "explain code",
    input: "代码输入",
    output: "解释结果",
    example: "function sum(a, b) {\n  return a + b;\n}",
    empty: "请输入需要解释的代码。",
  },
} as const;

function detectLanguage(code: string) {
  if (/<[A-Za-z][\s\S]*>/.test(code)) return "HTML / JSX";
  if (/^\s*def\s+\w+/m.test(code)) return "Python";
  if (/^\s*(function|const|let|var)\s+/m.test(code) || /=>/.test(code)) return "JavaScript / TypeScript";
  if (/^\s*(SELECT|INSERT|UPDATE|DELETE)\b/i.test(code)) return "SQL";
  return "General code";
}

function summarizeCode(code: string) {
  const lines = code.split("\n").map((line) => line.trim()).filter(Boolean);
  const nonEmptyLineCount = lines.length;
  const hasLoop = /\b(for|while)\b/.test(code);
  const hasCondition = /\b(if|switch|case)\b/.test(code);
  const hasReturn = /\breturn\b/.test(code);
  const hasAsync = /\b(async|await|Promise)\b/.test(code);
  const firstSignature =
    lines.find((line) => /function|def |class |const |let |var |SELECT|INSERT|UPDATE|DELETE/i.test(line)) ??
    lines[0] ??
    "";

  const bullets = [
    `Detected language / style: ${detectLanguage(code)}`,
    `Approximate non-empty lines: ${nonEmptyLineCount}`,
    `Likely entry point: ${firstSignature}`,
  ];

  if (hasLoop) bullets.push("Contains loop logic.");
  if (hasCondition) bullets.push("Contains conditional branching.");
  if (hasReturn) bullets.push("Returns a value or result.");
  if (hasAsync) bullets.push("Contains asynchronous behavior.");

  return bullets.join("\n");
}

export default function CodeExplainerLiteTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);

  const result = useMemo(() => {
    if (!input.trim()) return { error: text.empty };
    return { output: summarizeCode(input) };
  }, [input, text.empty]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/code-explainer-lite</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="code-explainer-lite-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="code-explainer-lite-input" value={input} onChange={(event) => setInput(event.target.value)} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.output}</div>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <textarea readOnly value={result.output} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
