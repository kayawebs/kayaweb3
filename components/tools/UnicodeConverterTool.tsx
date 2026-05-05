"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "iconv",
    encode: "Text to Unicode",
    decode: "Unicode to text",
    input: "Input",
    output: "Output",
    invalid: "Enter valid Unicode escapes, U+ codes, or HTML entities.",
    encodeExample: "Hello, 世界 👋",
    decodeExample: "\\u0048\\u0065\\u006c\\u006c\\u006f U+4E16 U+754C &#128075;",
  },
  zh: {
    command: "iconv",
    encode: "文本转 Unicode",
    decode: "Unicode 转文本",
    input: "输入",
    output: "输出",
    invalid: "请输入合法的 Unicode 转义、U+ 编码或 HTML 实体。",
    encodeExample: "Hello, 世界 👋",
    decodeExample: "\\u0048\\u0065\\u006c\\u006c\\u006f U+4E16 U+754C &#128075;",
  },
} as const;

function encodeUnicode(value: string) {
  return Array.from(value)
    .map((char) => {
      const codePoint = char.codePointAt(0);
      if (codePoint === undefined) return "";
      return `U+${codePoint.toString(16).toUpperCase().padStart(codePoint > 0xffff ? 6 : 4, "0")}`;
    })
    .join(" ");
}

function decodeUnicode(value: string) {
  const normalized = value
    .replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec: string) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/U\+([0-9a-fA-F]{4,6})/g, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)));

  if (/[\\](u(?![0-9a-fA-F]{4})|x)|U\+(?![0-9a-fA-F]{4,6})|&#(?:x[0-9a-fA-F]*|[0-9]*);?/.test(value)) {
    return { error: true };
  }

  return { output: normalized };
}

export default function UnicodeConverterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [encodeInput, setEncodeInput] = useState<string>(text.encodeExample);
  const [decodeInput, setDecodeInput] = useState<string>(text.decodeExample);

  const result = useMemo(() => {
    if (mode === "encode") {
      return { output: encodeUnicode(encodeInput) };
    }

    return decodeUnicode(decodeInput);
  }, [decodeInput, encodeInput, mode]);

  const input = mode === "encode" ? encodeInput : decodeInput;
  const setInput = mode === "encode" ? setEncodeInput : setDecodeInput;

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/unicode-converter</span>
        <span>{text.command}</span>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={() => setMode("encode")} className={`rounded border px-3 py-1.5 text-sm ${mode === "encode" ? "border-[var(--terminal-accent)] text-[var(--terminal-accent)]" : "border-[var(--terminal-border)] text-[var(--foreground)]/80"}`}>{text.encode}</button>
        <button type="button" onClick={() => setMode("decode")} className={`rounded border px-3 py-1.5 text-sm ${mode === "decode" ? "border-[var(--terminal-accent)] text-[var(--terminal-accent)]" : "border-[var(--terminal-border)] text-[var(--foreground)]/80"}`}>{text.decode}</button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="unicode-converter-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="unicode-converter-input" value={input} onChange={(event) => setInput(event.target.value)} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="unicode-converter-output" className="block text-sm font-medium">{text.output}</label>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{text.invalid}</p>
          ) : (
            <textarea id="unicode-converter-output" readOnly value={result.output} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
