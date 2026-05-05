/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "crop image",
    pick: "Choose image",
    x: "X",
    y: "Y",
    width: "Width",
    height: "Height",
    apply: "Apply crop",
    output: "Cropped preview",
    empty: "Select an image to crop.",
    invalid: "Could not crop this image.",
  },
  zh: {
    command: "crop image",
    pick: "选择图片",
    x: "X",
    y: "Y",
    width: "宽度",
    height: "高度",
    apply: "应用裁剪",
    output: "裁剪预览",
    empty: "请选择一张图片进行裁剪。",
    invalid: "这个图片无法完成裁剪。",
  },
} as const;

export default function ImageCropTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [x, setX] = useState("0");
  const [y, setY] = useState("0");
  const [width, setWidth] = useState("200");
  const [height, setHeight] = useState("200");

  const handleFile = (file: File | null) => {
    setError("");
    setResult("");
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = typeof reader.result === "string" ? reader.result : "";
      setSource(src);
      setResult(src);
    };
    reader.onerror = () => setError(text.invalid);
    reader.readAsDataURL(file);
  };

  const handleCrop = () => {
    if (!source) return;
    const cropX = Math.max(Number.parseInt(x, 10) || 0, 0);
    const cropY = Math.max(Number.parseInt(y, 10) || 0, 0);
    const cropWidth = Math.max(Number.parseInt(width, 10) || 1, 1);
    const cropHeight = Math.max(Number.parseInt(height, 10) || 1, 1);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setError(text.invalid);
        return;
      }
      ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      setResult(canvas.toDataURL("image/png"));
    };
    image.onerror = () => setError(text.invalid);
    image.src = source;
  };

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/image-crop-tool</span>
        <span>{text.command}</span>
      </div>
      <label className="block rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4 text-sm font-medium">
        <span className="block">{text.pick}</span>
        <input type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0] ?? null)} className="mt-3 block w-full text-sm" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {([
          [text.x, x, setX],
          [text.y, y, setY],
          [text.width, width, setWidth],
          [text.height, height, setHeight],
        ] as const).map(([label, value, setter]) => (
          <label key={label} className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
            <span className="block text-sm font-medium">{label}</span>
            <input value={value} onChange={(event) => setter(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
          </label>
        ))}
      </div>
      <button type="button" onClick={handleCrop} className="rounded-lg border border-[var(--terminal-accent)] bg-[var(--terminal-panel-bg)]/40 px-4 py-3 font-mono hover:bg-[var(--terminal-panel-bg)]/70">
        {text.apply}
      </button>
      {error ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{error}</p>
      ) : result ? (
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.output}</div>
          <img src={result} alt="cropped preview" className="max-h-96 rounded border border-[var(--terminal-border)] object-contain" />
        </div>
      ) : (
        <p className="rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/20 px-3 py-2 text-sm text-[var(--terminal-muted)]">{text.empty}</p>
      )}
    </section>
  );
}
