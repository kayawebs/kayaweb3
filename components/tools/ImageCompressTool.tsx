/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "compress image",
    pick: "Choose image",
    quality: "Quality",
    output: "Compressed preview",
    original: "Original size",
    compressed: "Compressed size",
    empty: "Select an image to compress.",
    invalid: "Could not compress this image.",
  },
  zh: {
    command: "compress image",
    pick: "选择图片",
    quality: "质量",
    output: "压缩预览",
    original: "原始大小",
    compressed: "压缩后大小",
    empty: "请选择一张图片进行压缩。",
    invalid: "这个图片无法完成压缩。",
  },
} as const;

function sizeOfDataUrl(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.round((base64.length * 3) / 4);
}

export default function ImageCompressTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [quality, setQuality] = useState(80);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [result, setResult] = useState("");
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleFile = (file: File | null) => {
    setError("");
    setResult("");
    setCompressedSize(null);
    setOriginalSize(file ? file.size : null);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setError(text.invalid);
          return;
        }
        ctx.drawImage(image, 0, 0);
        const compressed = canvas.toDataURL("image/jpeg", quality / 100);
        setResult(compressed);
        setCompressedSize(sizeOfDataUrl(compressed));
      };
      image.onerror = () => setError(text.invalid);
      image.src = typeof reader.result === "string" ? reader.result : "";
    };
    reader.onerror = () => setError(text.invalid);
    reader.readAsDataURL(file);
  };

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/image-compress-tool</span>
        <span>{text.command}</span>
      </div>
      <label className="block rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4 text-sm font-medium">
        <span className="block">{text.pick}</span>
        <input type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0] ?? null)} className="mt-3 block w-full text-sm" />
      </label>
      <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
        <span className="block text-sm font-medium">{text.quality}: {quality}%</span>
        <input type="range" min={20} max={100} value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="w-full" />
      </label>
      {error ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{error}</p>
      ) : result ? (
        <div className="space-y-4 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/20 p-3 text-sm">
              {text.original}: {originalSize ?? 0} B
            </div>
            <div className="rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/20 p-3 text-sm">
              {text.compressed}: {compressedSize ?? 0} B
            </div>
          </div>
          <div className="text-sm font-medium">{text.output}</div>
          <img src={result} alt="compressed preview" className="max-h-96 rounded border border-[var(--terminal-border)] object-contain" />
        </div>
      ) : (
        <p className="rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/20 px-3 py-2 text-sm text-[var(--terminal-muted)]">{text.empty}</p>
      )}
    </section>
  );
}
