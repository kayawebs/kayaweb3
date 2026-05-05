"use client";

import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";

import { createDownloadArtifact, formatBytes, revokeArtifacts, sanitizeBaseName } from "@/components/tools/pdf-utils";
import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "optimize pdf bytes",
    pick: "Choose PDF",
    compress: "Optimize PDF",
    empty: "Upload a PDF to run a lightweight browser-side optimization pass.",
    invalid: "Could not optimize this PDF file.",
    output: "Optimized PDF",
    original: "Original size",
    result: "Optimized size",
    change: "Change",
    note: "This browser-side pass removes some overhead and rewrites the file structure. It may not shrink every PDF.",
    download: "Download optimized PDF",
  },
  zh: {
    command: "optimize pdf bytes",
    pick: "选择 PDF",
    compress: "优化 PDF",
    empty: "上传 PDF 后可进行一次轻量的浏览器端结构优化。",
    invalid: "这个 PDF 文件无法完成优化。",
    output: "优化后的 PDF",
    original: "原始大小",
    result: "优化后大小",
    change: "变化",
    note: "这个浏览器端优化主要重写文件结构并移除部分冗余，并不保证每个 PDF 都会变小。",
    download: "下载优化后的 PDF",
  },
} as const;

export default function PdfCompressTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [file, setFile] = useState<File | null>(null);
  const [artifact, setArtifact] = useState<ReturnType<typeof createDownloadArtifact> | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (artifact) revokeArtifacts([artifact]);
    };
  }, [artifact]);

  const handleCompress = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer(), {
        ignoreEncryption: true,
        updateMetadata: false,
      });
      const bytes = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
        updateFieldAppearances: false,
      });
      setArtifact((current) => {
        if (current) revokeArtifacts([current]);
        return createDownloadArtifact(`${sanitizeBaseName(file.name, "document")}-optimized.pdf`, bytes);
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

  const delta = artifact && file ? artifact.size - file.size : 0;

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/pdf-compress-tool</span>
        <span>{text.command}</span>
      </div>
      <label className="block rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4 text-sm font-medium">
        <span className="block">{text.pick}</span>
        <input type="file" accept="application/pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="mt-3 block w-full text-sm" />
      </label>
      <button
        type="button"
        onClick={() => void handleCompress()}
        disabled={!file || loading}
        className="rounded-lg border border-[var(--terminal-accent)] px-4 py-2 text-sm font-medium text-[var(--terminal-accent)] transition-colors hover:bg-[var(--terminal-accent)]/10 disabled:cursor-not-allowed disabled:border-[var(--terminal-border)] disabled:text-[var(--terminal-muted)]"
      >
        {loading ? "..." : text.compress}
      </button>
      {error ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{error}</p>
      ) : artifact && file ? (
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.output}</div>
          <p className="text-sm text-[var(--terminal-muted)]">
            {text.original}: {formatBytes(file.size)}
          </p>
          <p className="text-sm text-[var(--terminal-muted)]">
            {text.result}: {formatBytes(artifact.size)}
          </p>
          <p className="text-sm text-[var(--terminal-muted)]">
            {text.change}: {delta > 0 ? "+" : ""}
            {formatBytes(Math.abs(delta))}
          </p>
          <p className="text-xs text-[var(--terminal-muted)]">{text.note}</p>
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
