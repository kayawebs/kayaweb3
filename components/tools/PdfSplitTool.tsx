"use client";

import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";

import { createDownloadArtifact, formatBytes, parsePageRanges, revokeArtifacts, sanitizeBaseName } from "@/components/tools/pdf-utils";
import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "split pdf ranges",
    pick: "Choose PDF",
    ranges: "Page ranges",
    placeholder: "1-2,4,7-9",
    build: "Split PDF",
    empty: "Upload a PDF, then split it by page ranges or individual pages.",
    invalid: "Could not split this PDF. Check the page ranges and file.",
    hint: "Leave blank to export each page as a separate PDF.",
    output: "Split files",
    download: "Download",
    pages: "pages",
  },
  zh: {
    command: "split pdf ranges",
    pick: "选择 PDF",
    ranges: "页码范围",
    placeholder: "1-2,4,7-9",
    build: "拆分 PDF",
    empty: "上传 PDF 后，可以按页码范围或逐页拆分。",
    invalid: "无法拆分这个 PDF，请检查文件和页码范围。",
    hint: "留空时会按单页分别导出 PDF。",
    output: "拆分结果",
    download: "下载",
    pages: "页",
  },
} as const;

export default function PdfSplitTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rangesInput, setRangesInput] = useState("");
  const [artifacts, setArtifacts] = useState<ReturnType<typeof createDownloadArtifact>[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => revokeArtifacts(artifacts);
  }, [artifacts]);

  const loadPageCount = async (nextFile: File | null) => {
    setFile(nextFile);
    setArtifacts((current) => {
      revokeArtifacts(current);
      return [];
    });
    setError("");

    if (!nextFile) {
      setPageCount(0);
      return;
    }

    try {
      const pdf = await PDFDocument.load(await nextFile.arrayBuffer());
      setPageCount(pdf.getPageCount());
    } catch {
      setPageCount(0);
      setError(text.invalid);
    }
  };

  const handleSplit = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const source = await PDFDocument.load(await file.arrayBuffer());
      const defaultRanges = source.getPageIndices().map((index) => ({ start: index + 1, end: index + 1 }));
      const ranges = parsePageRanges(rangesInput, source.getPageCount()) ?? defaultRanges;
      const baseName = sanitizeBaseName(file.name, "document");
      const nextArtifacts: ReturnType<typeof createDownloadArtifact>[] = [];

      for (const range of ranges) {
        const target = await PDFDocument.create();
        const indices = Array.from({ length: range.end - range.start + 1 }, (_, offset) => range.start - 1 + offset);
        const pages = await target.copyPages(source, indices);
        pages.forEach((page) => target.addPage(page));
        const bytes = await target.save();
        nextArtifacts.push(createDownloadArtifact(`${baseName}-${range.start}-${range.end}.pdf`, bytes));
      }

      setArtifacts((current) => {
        revokeArtifacts(current);
        return nextArtifacts;
      });
    } catch {
      setError(text.invalid);
      setArtifacts((current) => {
        revokeArtifacts(current);
        return [];
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/pdf-split-tool</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
        <label className="block rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4 text-sm font-medium">
          <span className="block">{text.pick}</span>
          <input type="file" accept="application/pdf" onChange={(event) => void loadPageCount(event.target.files?.[0] ?? null)} className="mt-3 block w-full text-sm" />
        </label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <span className="block text-sm font-medium">{text.ranges}</span>
          <input
            value={rangesInput}
            onChange={(event) => setRangesInput(event.target.value)}
            placeholder={text.placeholder}
            className="w-full rounded border border-[var(--terminal-border)] bg-[var(--background)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
          <p className="text-xs text-[var(--terminal-muted)]">{text.hint}</p>
        </label>
        <button
          type="button"
          onClick={() => void handleSplit()}
          disabled={!file || loading}
          className="rounded-lg border border-[var(--terminal-accent)] px-4 py-3 text-sm font-medium text-[var(--terminal-accent)] transition-colors hover:bg-[var(--terminal-accent)]/10 disabled:cursor-not-allowed disabled:border-[var(--terminal-border)] disabled:text-[var(--terminal-muted)]"
        >
          {loading ? "..." : text.build}
        </button>
      </div>
      {pageCount > 0 && (
        <p className="text-sm text-[var(--terminal-muted)]">
          {pageCount} {text.pages}
        </p>
      )}
      {error ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{error}</p>
      ) : artifacts.length > 0 ? (
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.output}</div>
          <div className="space-y-2">
            {artifacts.map((artifact) => (
              <a
                key={artifact.url}
                href={artifact.url}
                download={artifact.name}
                className="flex items-center justify-between gap-3 rounded border border-[var(--terminal-border)] px-3 py-2 text-sm transition-colors hover:border-[var(--terminal-accent)]"
              >
                <span className="truncate">{artifact.name}</span>
                <span className="shrink-0 font-mono text-xs text-[var(--terminal-muted)]">
                  {text.download} · {formatBytes(artifact.size)}
                </span>
              </a>
            ))}
          </div>
        </div>
      ) : (
        <p className="rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/20 px-3 py-2 text-sm text-[var(--terminal-muted)]">{text.empty}</p>
      )}
    </section>
  );
}
