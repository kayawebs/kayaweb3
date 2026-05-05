"use client";

import { useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "base64 encode file",
    pick: "Choose image",
    output: "Base64 output",
    preview: "Preview",
    empty: "Select an image file to convert.",
  },
  zh: {
    command: "base64 encode file",
    pick: "选择图片",
    output: "Base64 输出",
    preview: "预览",
    empty: "请选择一个图片文件进行转换。",
  },
} as const;

export default function ImageToBase64Tool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [result, setResult] = useState("");

  const handleFile = async (file: File | null) => {
    if (!file) {
      setResult("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setResult(typeof reader.result === "string" ? reader.result : "");
    reader.readAsDataURL(file);
  };

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/image-to-base64</span>
        <span>{text.command}</span>
      </div>
      <label className="block rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4 text-sm font-medium">
        <span className="block">{text.pick}</span>
        <input type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0] ?? null)} className="mt-3 block w-full text-sm" />
      </label>
      {result ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.output}</div>
            <textarea readOnly value={result} rows={16} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-xs outline-none" />
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.preview}</div>
            <img src={result} alt="preview" className="max-h-80 rounded border border-[var(--terminal-border)] object-contain" />
          </div>
        </div>
      ) : (
        <p className="rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/20 px-3 py-2 text-sm text-[var(--terminal-muted)]">{text.empty}</p>
      )}
    </section>
  );
}
