"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

type DiffLine = {
  type: "same" | "removed" | "added";
  value: string;
};

const TEXT = {
  en: {
    command: "diff -u",
    before: "Original text",
    after: "Updated text",
    summary: "Summary",
    same: "Unchanged",
    removed: "Removed",
    added: "Added",
    empty: "Enter text on either side to compare line changes.",
    leftExample: "apple\nbanana\ncarrot\ndelta",
    rightExample: "apple\nbanana split\ncarrot\necho",
  },
  zh: {
    command: "diff -u",
    before: "原始文本",
    after: "修改后文本",
    summary: "统计",
    same: "未变化",
    removed: "删除",
    added: "新增",
    empty: "至少在任意一侧输入文本后再比较行变化。",
    leftExample: "apple\nbanana\ncarrot\ndelta",
    rightExample: "apple\nbanana split\ncarrot\necho",
  },
} as const;

function buildLineDiff(leftLines: string[], rightLines: string[]) {
  const dp = Array.from({ length: leftLines.length + 1 }, () => Array.from({ length: rightLines.length + 1 }, () => 0));

  for (let i = leftLines.length - 1; i >= 0; i -= 1) {
    for (let j = rightLines.length - 1; j >= 0; j -= 1) {
      dp[i][j] = leftLines[i] === rightLines[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const lines: DiffLine[] = [];
  let i = 0;
  let j = 0;

  while (i < leftLines.length && j < rightLines.length) {
    if (leftLines[i] === rightLines[j]) {
      lines.push({ type: "same", value: leftLines[i] });
      i += 1;
      j += 1;
      continue;
    }

    if (dp[i + 1][j] >= dp[i][j + 1]) {
      lines.push({ type: "removed", value: leftLines[i] });
      i += 1;
    } else {
      lines.push({ type: "added", value: rightLines[j] });
      j += 1;
    }
  }

  while (i < leftLines.length) {
    lines.push({ type: "removed", value: leftLines[i] });
    i += 1;
  }

  while (j < rightLines.length) {
    lines.push({ type: "added", value: rightLines[j] });
    j += 1;
  }

  return lines;
}

export default function TextDiffCheckerTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [left, setLeft] = useState<string>(text.leftExample);
  const [right, setRight] = useState<string>(text.rightExample);

  const diff = useMemo(() => {
    const leftLines = left.split(/\r?\n/);
    const rightLines = right.split(/\r?\n/);
    const rows = buildLineDiff(leftLines, rightLines);

    return {
      rows,
      same: rows.filter((row) => row.type === "same").length,
      removed: rows.filter((row) => row.type === "removed").length,
      added: rows.filter((row) => row.type === "added").length,
    };
  }, [left, right]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/text-diff-checker</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="text-diff-left" className="block text-sm font-medium">{text.before}</label>
          <textarea id="text-diff-left" value={left} onChange={(event) => setLeft(event.target.value)} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="text-diff-right" className="block text-sm font-medium">{text.after}</label>
          <textarea id="text-diff-right" value={right} onChange={(event) => setRight(event.target.value)} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.same}</div><div className="mt-1 text-lg font-semibold">{diff.same}</div></div>
        <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.removed}</div><div className="mt-1 text-lg font-semibold text-rose-300">{diff.removed}</div></div>
        <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.added}</div><div className="mt-1 text-lg font-semibold text-emerald-300">{diff.added}</div></div>
      </div>
      <div className="space-y-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
        <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.summary}</div>
        {left.length === 0 && right.length === 0 ? (
          <p className="text-sm text-[var(--terminal-muted)]">{text.empty}</p>
        ) : (
          <div className="space-y-2 font-mono text-sm">
            {diff.rows.map((row, index) => (
              <div
                key={`${row.type}-${index}-${row.value}`}
                className={`rounded border px-3 py-2 ${
                  row.type === "same"
                    ? "border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/20 text-[var(--foreground)]/85"
                    : row.type === "removed"
                      ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
                      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                }`}
              >
                <span className="mr-2 inline-block w-4">{row.type === "same" ? " " : row.type === "removed" ? "-" : "+"}</span>
                <span>{row.value || "\u00A0"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
