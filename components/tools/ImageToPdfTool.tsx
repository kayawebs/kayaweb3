"use client";

import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";

import { createDownloadArtifact, formatBytes, revokeArtifacts, sanitizeBaseName } from "@/components/tools/pdf-utils";
import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "bundle images to pdf",
    pick: "Choose images",
    build: "Create PDF",
    empty: "Select one or more images to build a PDF.",
    invalid: "Could not convert the selected images.",
    output: "Generated PDF",
    ready: "Your PDF is ready to download.",
    download: "Download PDF",
    images: "images",
  },
  zh: {
    command: "bundle images to pdf",
    pick: "选择图片",
    build: "生成 PDF",
    empty: "请选择一张或多张图片来生成 PDF。",
    invalid: "这些图片无法转换成 PDF。",
    output: "生成的 PDF",
    ready: "PDF 已生成，可以直接下载。",
    download: "下载 PDF",
    images: "张图片",
  },
} as const;

export default function ImageToPdfTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [files, setFiles] = useState<File[]>([]);
  const [artifact, setArtifact] = useState<ReturnType<typeof createDownloadArtifact> | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (artifact) revokeArtifacts([artifact]);
    };
  }, [artifact]);

  const handleBuild = async () => {
    if (files.length === 0) {
      setArtifact(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const pdf = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const embedded = file.type === "image/png" ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
        const page = pdf.addPage([embedded.width, embedded.height]);
        page.drawImage(embedded, {
          x: 0,
          y: 0,
          width: embedded.width,
          height: embedded.height,
        });
      }

      const bytes = await pdf.save();
      setArtifact((current) => {
        if (current) revokeArtifacts([current]);
        return createDownloadArtifact(`${sanitizeBaseName(files[0]?.name ?? "", "images")}.pdf`, bytes);
      });
    } catch {
      setError(text.invalid);
      setArtifact((current) => {
        if (current) revokeArtifacts([current]);
        return null;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/image-to-pdf</span>
        <span>{text.command}</span>
      </div>
      <label className="block rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4 text-sm font-medium">
        <span className="block">{text.pick}</span>
        <input
          type="file"
          accept="image/png,image/jpeg"
          multiple
          onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
          className="mt-3 block w-full text-sm"
        />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void handleBuild()}
          disabled={files.length === 0 || loading}
          className="rounded-lg border border-[var(--terminal-accent)] px-4 py-2 text-sm font-medium text-[var(--terminal-accent)] transition-colors hover:bg-[var(--terminal-accent)]/10 disabled:cursor-not-allowed disabled:border-[var(--terminal-border)] disabled:text-[var(--terminal-muted)]"
        >
          {loading ? "..." : text.build}
        </button>
        {files.length > 0 && (
          <span className="text-sm text-[var(--terminal-muted)]">
            {files.length} {text.images}
          </span>
        )}
      </div>
      {error ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{error}</p>
      ) : artifact ? (
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.output}</div>
          <p className="text-sm text-[var(--terminal-muted)]">{text.ready}</p>
          <p className="text-sm text-[var(--terminal-muted)]">{formatBytes(artifact.size)}</p>
          <a
            href={artifact.url}
            download={artifact.name}
            className="inline-flex rounded border border-[var(--terminal-accent)] px-3 py-2 text-sm font-medium text-[var(--terminal-accent)] transition-colors hover:bg-[var(--terminal-accent)]/10"
          >
            {text.download}
          </a>
        </div>
      ) : (
        <p className="rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/20 px-3 py-2 text-sm text-[var(--terminal-muted)]">{text.empty}</p>
      )}
    </section>
  );
}
