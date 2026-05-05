/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";

import { formatBytes, sanitizeBaseName } from "@/components/tools/pdf-utils";
import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "render pdf page",
    pick: "Choose PDF",
    page: "Page",
    scale: "Scale",
    load: "Render page",
    preview: "PNG preview",
    empty: "Select a PDF to render a page into an image.",
    invalid: "Could not read this PDF file.",
    pages: "pages",
    info: "Document info",
    download: "Download PNG",
    size: "Image size",
  },
  zh: {
    command: "render pdf page",
    pick: "选择 PDF",
    page: "页码",
    scale: "缩放",
    load: "渲染页面",
    preview: "PNG 预览",
    empty: "请选择一个 PDF 文件并渲染页面图片。",
    invalid: "这个 PDF 文件无法读取。",
    pages: "页",
    info: "文档信息",
    download: "下载 PNG",
    size: "图片大小",
  },
} as const;

const SCALE_OPTIONS = [1, 1.5, 2] as const;

export default function PdfToImageTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [file, setFile] = useState<File | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [scale, setScale] = useState<(typeof SCALE_OPTIONS)[number]>(1.5);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewSize, setPreviewSize] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const renderPage = async (nextFile: File | null, nextPage = 1, nextScale = scale) => {
    if (!nextFile) {
      setPreviewUrl("");
      setPageCount(0);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      const task = pdfjs.getDocument({
        data: new Uint8Array(await nextFile.arrayBuffer()),
      });
      const pdf = await task.promise;
      const safePage = Math.min(Math.max(nextPage, 1), pdf.numPages);
      const page = await pdf.getPage(safePage);
      const viewport = page.getViewport({ scale: nextScale });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("canvas");
      }

      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);

      await page.render({ canvas, canvasContext: context, viewport }).promise;
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));

      if (!blob) {
        throw new Error("blob");
      }

      setPageCount(pdf.numPages);
      setPageNumber(safePage);
      setPreviewSize(blob.size);
      setPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return URL.createObjectURL(blob);
      });
    } catch {
      setError(text.invalid);
      setPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return "";
      });
      setPageCount(0);
      setPreviewSize(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/pdf-to-image</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <label className="block rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4 text-sm font-medium">
          <span className="block">{text.pick}</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => {
              const nextFile = event.target.files?.[0] ?? null;
              setFile(nextFile);
              void renderPage(nextFile, 1);
            }}
            className="mt-3 block w-full text-sm"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
            <span className="block text-sm font-medium">{text.page}</span>
            <input
              type="number"
              min={1}
              max={Math.max(pageCount, 1)}
              value={pageNumber}
              onChange={(event) => setPageNumber(Number(event.target.value) || 1)}
              className="w-full rounded border border-[var(--terminal-border)] bg-[var(--background)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
            />
          </label>
          <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
            <span className="block text-sm font-medium">{text.scale}</span>
            <select
              value={scale}
              onChange={(event) => setScale(Number(event.target.value) as (typeof SCALE_OPTIONS)[number])}
              className="w-full rounded border border-[var(--terminal-border)] bg-[var(--background)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
            >
              {SCALE_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}x
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => void renderPage(file, pageNumber, scale)}
            disabled={!file || loading}
            className="rounded-lg border border-[var(--terminal-accent)] px-4 py-3 text-sm font-medium text-[var(--terminal-accent)] transition-colors hover:bg-[var(--terminal-accent)]/10 disabled:cursor-not-allowed disabled:border-[var(--terminal-border)] disabled:text-[var(--terminal-muted)]"
          >
            {loading ? "..." : text.load}
          </button>
        </div>
      </div>
      {error ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{error}</p>
      ) : previewUrl ? (
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.info}</div>
            <p className="text-sm text-[var(--terminal-muted)]">
              {pageCount} {text.pages}
            </p>
            <p className="text-sm text-[var(--terminal-muted)]">
              {text.size}: {formatBytes(previewSize)}
            </p>
            <a
              href={previewUrl}
              download={`${sanitizeBaseName(file?.name ?? "", "document")}-page-${pageNumber}.png`}
              className="inline-flex rounded border border-[var(--terminal-accent)] px-3 py-2 text-sm font-medium text-[var(--terminal-accent)] transition-colors hover:bg-[var(--terminal-accent)]/10"
            >
              {text.download}
            </a>
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.preview}</div>
            <img src={previewUrl} alt="pdf page preview" className="max-h-[36rem] w-full rounded border border-[var(--terminal-border)] object-contain" />
          </div>
        </div>
      ) : (
        <p className="rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/20 px-3 py-2 text-sm text-[var(--terminal-muted)]">{text.empty}</p>
      )}
    </section>
  );
}
