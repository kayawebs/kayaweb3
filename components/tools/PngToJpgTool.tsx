/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "png > jpg",
    pick: "Choose PNG image",
    output: "JPG preview",
    empty: "Select a PNG image to convert.",
    invalid: "Could not convert this image.",
  },
  zh: {
    command: "png > jpg",
    pick: "选择 PNG 图片",
    output: "JPG 预览",
    empty: "请选择一个 PNG 图片进行转换。",
    invalid: "这个图片无法完成转换。",
  },
} as const;

export default function PngToJpgTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleFile = (file: File | null) => {
    setError("");
    setResult("");
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
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
        setResult(canvas.toDataURL("image/jpeg", 0.92));
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
        <span className="terminal-accent">~/tools/png-to-jpg</span>
        <span>{text.command}</span>
      </div>
      <label className="block rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4 text-sm font-medium">
        <span className="block">{text.pick}</span>
        <input type="file" accept=".png,image/png" onChange={(event) => handleFile(event.target.files?.[0] ?? null)} className="mt-3 block w-full text-sm" />
      </label>
      {error ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{error}</p>
      ) : result ? (
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.output}</div>
          <img src={result} alt="jpg preview" className="max-h-96 rounded border border-[var(--terminal-border)] object-contain" />
          <textarea readOnly value={result} rows={8} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-xs outline-none" />
        </div>
      ) : (
        <p className="rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/20 px-3 py-2 text-sm text-[var(--terminal-muted)]">{text.empty}</p>
      )}
    </section>
  );
}
