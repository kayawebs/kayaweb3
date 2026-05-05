"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const encoder = new TextEncoder();

const TEXT = {
  en: {
    command: "xxd -b",
    input: "Text input",
    output: "Binary output",
    joiner: "Byte separator",
    spaces: "Spaces",
    lines: "Line breaks",
    example: "Hello",
  },
  zh: {
    command: "xxd -b",
    input: "文本输入",
    output: "二进制输出",
    joiner: "字节分隔方式",
    spaces: "空格",
    lines: "换行",
    example: "Hello",
  },
} as const;

export default function TextToBinaryTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);
  const [separator, setSeparator] = useState<"space" | "line">("space");

  const output = useMemo(() => {
    const bytes = encoder.encode(input);
    return Array.from(bytes, (byte) => byte.toString(2).padStart(8, "0")).join(separator === "space" ? " " : "\n");
  }, [input, separator]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/text-to-binary</span>
        <span>{text.command}</span>
      </div>

      <div className="rounded border border-[var(--terminal-border)] px-3 py-3">
        <div className="mb-2 text-xs font-mono text-[var(--terminal-muted)]">{text.joiner}</div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setSeparator("space")} className={`rounded border px-3 py-1.5 text-sm ${separator === "space" ? "border-[var(--terminal-accent)] text-[var(--terminal-accent)]" : "border-[var(--terminal-border)] text-[var(--foreground)]/80"}`}>{text.spaces}</button>
          <button type="button" onClick={() => setSeparator("line")} className={`rounded border px-3 py-1.5 text-sm ${separator === "line" ? "border-[var(--terminal-accent)] text-[var(--terminal-accent)]" : "border-[var(--terminal-border)] text-[var(--foreground)]/80"}`}>{text.lines}</button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="text-to-binary-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="text-to-binary-input" value={input} onChange={(event) => setInput(event.target.value)} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="text-to-binary-output" className="block text-sm font-medium">{text.output}</label>
          <textarea id="text-to-binary-output" readOnly value={output} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
        </div>
      </div>
    </section>
  );
}
