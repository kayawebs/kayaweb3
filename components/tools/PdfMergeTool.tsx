"use client";

import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";

import { createDownloadArtifact, formatBytes, revokeArtifacts, sanitizeBaseName } from "@/components/tools/pdf-utils";
import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "merge pdf files",
    pick: "Choose PDFs",
    merge: "Merge files",
    empty: "Select two or more PDF files to merge them.",
    invalid: "Could not merge these PDF files.",
    output: "Merged PDF",
    download: "Download merged PDF",
    files: "files",
  },
  zh: {
    command: "merge pdf files",
    pick: "选择 PDF",
    merge: "合并文件",
    empty: "请选择两个或更多 PDF 文件进行合并。",
    invalid: "这些 PDF 文件无法完成合并。",
    output: "合并后的 PDF",
    download: "下载合并后的 PDF",
    files: "个文件",
  },
} as const;

export default function PdfMergeTool({ locale = "en" }: { locale?: ToolLocale }) {
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

  const handleMerge = async () => {
    if (files.length < 2) return;

    setLoading(true);
    setError("");

    try {
      const merged = await PDFDocument.create();

      for (const file of files) {
        const source = await PDFDocument.load(await file.arrayBuffer());
        const copiedPages = await merged.copyPages(source, source.getPageIndices());
        copiedPages.forEach((page) => merged.addPage(page));
      }

      const bytes = await merged.save();
      setArtifact((current) => {
        if (current) revokeArtifacts([current]);
        return createDownloadArtifact(`${sanitizeBaseName(files[0]?.name ?? "", "merged")}-merged.pdf`, bytes);
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
        <span className="terminal-accent">~/tools/pdf-merge-tool</span>
        <span>{text.command}</span>
      </div>
      <label className="block rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4 text-sm font-medium">
        <span className="block">{text.pick}</span>
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
          className="mt-3 block w-full text-sm"
        />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void handleMerge()}
          disabled={files.length < 2 || loading}
          className="rounded-lg border border-[var(--terminal-accent)] px-4 py-2 text-sm font-medium text-[var(--terminal-accent)] transition-colors hover:bg-[var(--terminal-accent)]/10 disabled:cursor-not-allowed disabled:border-[var(--terminal-border)] disabled:text-[var(--terminal-muted)]"
        >
          {loading ? "..." : text.merge}
        </button>
        {files.length > 0 && (
          <span className="text-sm text-[var(--terminal-muted)]">
            {files.length} {text.files}
          </span>
        )}
      </div>
      {error ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{error}</p>
      ) : artifact ? (
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.output}</div>
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
