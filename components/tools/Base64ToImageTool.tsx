"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "decode base64 image",
    input: "Base64 input",
    preview: "Image preview",
    example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB...",
    invalid: "Enter a valid data URL or image base64 string.",
  },
  zh: {
    command: "decode base64 image",
    input: "Base64 输入",
    preview: "图片预览",
    example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB...",
    invalid: "请输入合法的 data URL 或图片 base64 字符串。",
  },
} as const;

function normalizeInput(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("data:image/")) return trimmed;
  if (/^[A-Za-z0-9+/=\s]+$/.test(trimmed)) {
    return `data:image/png;base64,${trimmed.replace(/\s+/g, "")}`;
  }
  return null;
}

export default function Base64ToImageTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState("");

  const result = useMemo(() => normalizeInput(input), [input]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/base64-to-image</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="base64-to-image-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="base64-to-image-input" value={input} onChange={(event) => setInput(event.target.value)} rows={16} placeholder={text.example} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-xs outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.preview}</div>
          {result ? (
            <img src={result} alt="decoded preview" className="max-h-80 rounded border border-[var(--terminal-border)] object-contain" />
          ) : (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{text.invalid}</p>
          )}
        </div>
      </div>
    </section>
  );
}
