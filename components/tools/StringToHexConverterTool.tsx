"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const encoder = new TextEncoder();

const TEXT = {
  en: {
    command: "xxd -p",
    input: "Text input",
    output: "Hex output",
    spaced: "Space-separated bytes",
    example: "Hello, kaya",
  },
  zh: {
    command: "xxd -p",
    input: "文本输入",
    output: "十六进制输出",
    spaced: "按字节空格分隔",
    example: "Hello, kaya",
  },
} as const;

export default function StringToHexConverterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);
  const [spaced, setSpaced] = useState(false);

  const output = useMemo(() => {
    const bytes = encoder.encode(input);
    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
    return spaced ? hex.join(" ") : hex.join("");
  }, [input, spaced]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/string-to-hex-converter</span>
        <span>{text.command}</span>
      </div>
      <label className="flex items-center gap-2 rounded border border-[var(--terminal-border)] px-3 py-2 text-sm">
        <input type="checkbox" checked={spaced} onChange={(event) => setSpaced(event.target.checked)} />
        <span>{text.spaced}</span>
      </label>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="string-to-hex-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="string-to-hex-input" value={input} onChange={(event) => setInput(event.target.value)} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="string-to-hex-output" className="block text-sm font-medium">{text.output}</label>
          <textarea id="string-to-hex-output" readOnly value={output} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
        </div>
      </div>
    </section>
  );
}
