"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "encodeURIComponent",
    input: "Text / URL component input",
    encode: "encode",
    decode: "decode",
    output: "Output",
    invalid: "Enter valid percent-encoded text to decode.",
  },
  zh: {
    command: "encodeURIComponent",
    input: "文本 / URL 片段输入",
    encode: "编码",
    decode: "解码",
    output: "结果",
    invalid: "请输入有效的百分号编码文本后再解码。",
  },
} as const;

export default function UrlEncodeDecodeTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>("hello kaya?chain=base&lang=zh");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const result = useMemo(() => {
    try {
      return { output: mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input) };
    } catch {
      return { error: text.invalid };
    }
  }, [input, mode, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/url-encode-decode</span>
        <span>{text.command}</span>
      </div>
      <div className="flex flex-wrap gap-2 text-xs font-mono">
        <button type="button" onClick={() => setMode("encode")} className={`rounded border px-2 py-1 ${mode === "encode" ? "border-[var(--terminal-accent)] text-[var(--terminal-accent)]" : "border-[var(--terminal-border)]"}`}>{text.encode}</button>
        <button type="button" onClick={() => setMode("decode")} className={`rounded border px-2 py-1 ${mode === "decode" ? "border-[var(--terminal-accent)] text-[var(--terminal-accent)]" : "border-[var(--terminal-border)]"}`}>{text.decode}</button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="url-encode-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="url-encode-input" value={input} onChange={(e) => setInput(e.target.value)} rows={10} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="url-encode-output" className="block text-sm font-medium">{text.output}</label>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <textarea id="url-encode-output" readOnly value={result.output} rows={10} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
