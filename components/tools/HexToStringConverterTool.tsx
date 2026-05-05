"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const decoder = new TextDecoder();

const TEXT = {
  en: {
    command: "xxd -r -p",
    input: "Hex input",
    output: "Decoded text",
    invalid: "Enter valid hexadecimal input with an even number of characters.",
    example: "48656c6c6f2c206b617961",
  },
  zh: {
    command: "xxd -r -p",
    input: "十六进制输入",
    output: "解码文本",
    invalid: "请输入合法的十六进制内容，并保证字符数为偶数。",
    example: "48656c6c6f2c206b617961",
  },
} as const;

function decodeHex(value: string) {
  const compact = value.replace(/\s+/g, "").trim();
  if (!compact) return { output: "" };
  if (!/^[0-9a-fA-F]+$/.test(compact) || compact.length % 2 !== 0) {
    return { error: true };
  }
  const bytes = new Uint8Array(compact.match(/.{2}/g)?.map((pair) => parseInt(pair, 16)) ?? []);
  return { output: decoder.decode(bytes) };
}

export default function HexToStringConverterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);
  const result = useMemo(() => decodeHex(input), [input]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/hex-to-string-converter</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="hex-to-string-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="hex-to-string-input" value={input} onChange={(event) => setInput(event.target.value)} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="hex-to-string-output" className="block text-sm font-medium">{text.output}</label>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{text.invalid}</p>
          ) : (
            <textarea id="hex-to-string-output" readOnly value={result.output} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
