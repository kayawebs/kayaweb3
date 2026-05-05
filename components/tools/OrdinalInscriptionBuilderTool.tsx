"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "build inscription plan",
    content: "Inscription text content",
    mimeType: "MIME type",
    destination: "Destination address",
    postage: "Postage (sats)",
    contentHex: "Content hex preview",
    manifest: "Inscription manifest",
    invalid: "Enter content, MIME type, a destination string, and a non-negative postage value.",
  },
  zh: {
    command: "build inscription plan",
    content: "铭文文本内容",
    mimeType: "MIME 类型",
    destination: "目标地址",
    postage: "Postage（sats）",
    contentHex: "内容 hex 预览",
    manifest: "铭文清单",
    invalid: "请输入内容、MIME 类型、目标地址字符串，以及非负 postage 数值。",
  },
} as const;

function safeSerialize(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export default function OrdinalInscriptionBuilderTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [content, setContent] = useState<string>("Hello ordinals");
  const [mimeType, setMimeType] = useState<string>("text/plain;charset=utf-8");
  const [destination, setDestination] = useState<string>("bc1...");
  const [postage, setPostage] = useState<string>("546");

  const result = useMemo(() => {
    const postageValue = Number.parseInt(postage, 10);
    if (!content.trim() || !mimeType.trim() || !destination.trim() || !Number.isFinite(postageValue) || postageValue < 0) {
      return { error: text.invalid };
    }

    const contentBytes = new TextEncoder().encode(content);
    const mimeBytes = new TextEncoder().encode(mimeType.trim());

    return {
      contentHex: toHex(contentBytes),
      manifest: safeSerialize({
        protocol: "ord",
        mimeType: mimeType.trim(),
        destination: destination.trim(),
        postageSats: postageValue,
        contentBytes: contentBytes.length,
        mimeTypeBytes: mimeBytes.length,
        estimatedChunkCount: Math.max(1, Math.ceil(contentBytes.length / 520)),
        revealPreview: {
          marker: "ord",
          bodyHexPrefix: `6f7264${toHex(mimeBytes).slice(0, 24)}...`,
        },
      }),
    };
  }, [content, destination, mimeType, postage, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/ordinal-inscription-builder</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <span className="block text-sm font-medium">{text.content}</span>
            <textarea value={content} onChange={(event) => setContent(event.target.value)} rows={8} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
          </label>
          {([
            [text.mimeType, mimeType, setMimeType],
            [text.destination, destination, setDestination],
            [text.postage, postage, setPostage],
          ] as const).map(([label, value, setter]) => (
            <label key={label} className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
              <span className="block text-sm font-medium">{label}</span>
              <input type="text" value={value} onChange={(event) => setter(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
            </label>
          ))}
        </div>
        <div className="space-y-4">
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <>
              <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
                <div className="text-sm font-medium">{text.contentHex}</div>
                <textarea readOnly value={result.contentHex} rows={8} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
              </div>
              <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
                <div className="text-sm font-medium">{text.manifest}</div>
                <textarea readOnly value={result.manifest} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
