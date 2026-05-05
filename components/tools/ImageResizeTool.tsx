/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "resize image",
    pick: "Choose image",
    width: "Width",
    height: "Height",
    keepRatio: "Keep aspect ratio",
    apply: "Apply resize",
    output: "Resized preview",
    empty: "Select an image to resize.",
    invalid: "Could not resize this image.",
  },
  zh: {
    command: "resize image",
    pick: "选择图片",
    width: "宽度",
    height: "高度",
    keepRatio: "保持比例",
    apply: "应用缩放",
    output: "缩放预览",
    empty: "请选择一张图片进行缩放。",
    invalid: "这个图片无法完成缩放。",
  },
} as const;

export default function ImageResizeTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [width, setWidth] = useState("800");
  const [height, setHeight] = useState("600");
  const [keepRatio, setKeepRatio] = useState(true);

  const handleFile = (file: File | null) => {
    setError("");
    setResult("");
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = typeof reader.result === "string" ? reader.result : "";
      setSource(src);
      const image = new Image();
      image.onload = () => {
        setWidth(String(image.width));
        setHeight(String(image.height));
        setResult(src);
      };
      image.src = src;
    };
    reader.onerror = () => setError(text.invalid);
    reader.readAsDataURL(file);
  };

  const handleResize = () => {
    if (!source) return;
    setError("");
    const nextWidth = Math.max(Number.parseInt(width, 10) || 1, 1);
    const nextHeight = Math.max(Number.parseInt(height, 10) || 1, 1);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = nextWidth;
      canvas.height = nextHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setError(text.invalid);
        return;
      }
      ctx.drawImage(image, 0, 0, nextWidth, nextHeight);
      setResult(canvas.toDataURL("image/png"));
    };
    image.onerror = () => setError(text.invalid);
    image.src = source;
  };

  const syncHeight = (nextWidthRaw: string) => {
    setWidth(nextWidthRaw);
    if (!keepRatio || !source) return;
    const image = new Image();
    image.onload = () => {
      const nextWidth = Math.max(Number.parseInt(nextWidthRaw, 10) || image.width, 1);
      setHeight(String(Math.round((image.height / image.width) * nextWidth)));
    };
    image.src = source;
  };

  const syncWidth = (nextHeightRaw: string) => {
    setHeight(nextHeightRaw);
    if (!keepRatio || !source) return;
    const image = new Image();
    image.onload = () => {
      const nextHeight = Math.max(Number.parseInt(nextHeightRaw, 10) || image.height, 1);
      setWidth(String(Math.round((image.width / image.height) * nextHeight)));
    };
    image.src = source;
  };

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/image-resize-tool</span>
        <span>{text.command}</span>
      </div>
      <label className="block rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4 text-sm font-medium">
        <span className="block">{text.pick}</span>
        <input type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0] ?? null)} className="mt-3 block w-full text-sm" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <span className="block text-sm font-medium">{text.width}</span>
          <input value={width} onChange={(event) => syncHeight(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <span className="block text-sm font-medium">{text.height}</span>
          <input value={height} onChange={(event) => syncWidth(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </label>
        <label className="flex items-center gap-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4 text-sm">
          <input type="checkbox" checked={keepRatio} onChange={(event) => setKeepRatio(event.target.checked)} />
          <span>{text.keepRatio}</span>
        </label>
      </div>
      <button type="button" onClick={handleResize} className="rounded-lg border border-[var(--terminal-accent)] bg-[var(--terminal-panel-bg)]/40 px-4 py-3 font-mono hover:bg-[var(--terminal-panel-bg)]/70">
        {text.apply}
      </button>
      {error ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{error}</p>
      ) : result ? (
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.output}</div>
          <img src={result} alt="resized preview" className="max-h-96 rounded border border-[var(--terminal-border)] object-contain" />
        </div>
      ) : (
        <p className="rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/20 px-3 py-2 text-sm text-[var(--terminal-muted)]">{text.empty}</p>
      )}
    </section>
  );
}
