"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

type OutputType = "p2tr" | "p2wpkh";

const BASE_REVEAL_VBYTES: Record<OutputType, number> = {
  p2tr: 95,
  p2wpkh: 110,
};

const TEXT = {
  en: {
    command: "estimate ordinal size",
    contentBytes: "Content bytes",
    mimeLength: "MIME type length",
    chunkSize: "Chunk size",
    outputType: "Output type",
    chunks: "Chunk count",
    scriptBytes: "Estimated script bytes",
    revealBytes: "Estimated reveal bytes",
    revealVbytes: "Estimated reveal vbytes",
    invalid: "Enter non-negative byte values and a positive chunk size.",
    p2tr: "P2TR",
    p2wpkh: "P2WPKH",
  },
  zh: {
    command: "estimate ordinal size",
    contentBytes: "内容字节数",
    mimeLength: "MIME 类型长度",
    chunkSize: "分块大小",
    outputType: "输出类型",
    chunks: "分块数量",
    scriptBytes: "预估脚本字节",
    revealBytes: "预估 reveal 字节",
    revealVbytes: "预估 reveal vbytes",
    invalid: "请输入非负字节值和正数分块大小。",
    p2tr: "P2TR",
    p2wpkh: "P2WPKH",
  },
} as const;

export default function OrdinalSizeCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [contentBytes, setContentBytes] = useState<string>("2048");
  const [mimeLength, setMimeLength] = useState<string>("24");
  const [chunkSize, setChunkSize] = useState<string>("520");
  const [outputType, setOutputType] = useState<OutputType>("p2tr");

  const result = useMemo(() => {
    const content = Number.parseInt(contentBytes, 10);
    const mime = Number.parseInt(mimeLength, 10);
    const chunk = Number.parseInt(chunkSize, 10);

    if (!Number.isFinite(content) || !Number.isFinite(mime) || !Number.isFinite(chunk) || content < 0 || mime < 0 || chunk <= 0) {
      return { error: text.invalid };
    }

    const chunks = Math.max(1, Math.ceil(content / chunk));
    const pushOverhead = chunks * 3;
    const envelopeOverhead = 32 + mime + chunks * 2;
    const scriptBytes = envelopeOverhead + content + pushOverhead;
    const revealBytes = BASE_REVEAL_VBYTES[outputType] + scriptBytes;
    const revealVbytes = Math.ceil(revealBytes * 0.75);

    return {
      chunks: chunks.toString(),
      scriptBytes: scriptBytes.toString(),
      revealBytes: revealBytes.toString(),
      revealVbytes: revealVbytes.toString(),
    };
  }, [chunkSize, contentBytes, mimeLength, outputType, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/ordinal-size-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <span className="block text-sm font-medium">{text.contentBytes}</span>
          <input type="text" value={contentBytes} onChange={(event) => setContentBytes(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <span className="block text-sm font-medium">{text.mimeLength}</span>
          <input type="text" value={mimeLength} onChange={(event) => setMimeLength(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <span className="block text-sm font-medium">{text.chunkSize}</span>
          <input type="text" value={chunkSize} onChange={(event) => setChunkSize(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <span className="block text-sm font-medium">{text.outputType}</span>
          <select value={outputType} onChange={(event) => setOutputType(event.target.value as OutputType)} className="w-full rounded border border-[var(--terminal-border)] bg-[var(--background)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]">
            <option value="p2tr">{text.p2tr}</option>
            <option value="p2wpkh">{text.p2wpkh}</option>
          </select>
        </label>
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-4">
          {([
            [text.chunks, result.chunks],
            [text.scriptBytes, result.scriptBytes],
            [text.revealBytes, result.revealBytes],
            [text.revealVbytes, result.revealVbytes],
          ] as const).map(([label, value]) => (
            <div key={label} className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
              <div className="text-sm font-medium">{label}</div>
              <textarea readOnly value={value} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
