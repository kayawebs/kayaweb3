"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

type DiffItem = {
  key: string;
  type: "added" | "removed" | "changed";
  before?: unknown;
  after?: unknown;
};

const TEXT = {
  en: {
    command: "jq diff",
    left: "Original JSON",
    right: "Updated JSON",
    invalid: "Both inputs must be valid JSON.",
    none: "No differences found.",
    added: "Added",
    removed: "Removed",
    changed: "Changed",
    exampleLeft: '{\n  "name": "kaya",\n  "age": 20,\n  "tags": ["dev"]\n}',
    exampleRight: '{\n  "name": "kaya",\n  "age": 21,\n  "tags": ["dev", "writer"],\n  "active": true\n}',
  },
  zh: {
    command: "jq diff",
    left: "原始 JSON",
    right: "更新后 JSON",
    invalid: "两侧输入都必须是合法 JSON。",
    none: "没有发现差异。",
    added: "新增",
    removed: "删除",
    changed: "修改",
    exampleLeft: '{\n  "name": "kaya",\n  "age": 20,\n  "tags": ["dev"]\n}',
    exampleRight: '{\n  "name": "kaya",\n  "age": 21,\n  "tags": ["dev", "writer"],\n  "active": true\n}',
  },
} as const;

function flattenJson(value: unknown, prefix = "", output: Record<string, unknown> = {}) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      flattenJson(item, `${prefix}[${index}]`, output);
    });
    if (value.length === 0 && prefix) output[prefix] = [];
    return output;
  }

  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    entries.forEach(([key, item]) => {
      const next = prefix ? `${prefix}.${key}` : key;
      flattenJson(item, next, output);
    });
    if (entries.length === 0 && prefix) output[prefix] = {};
    return output;
  }

  output[prefix || "$"] = value;
  return output;
}

export default function JsonDiffViewerTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [left, setLeft] = useState<string>(text.exampleLeft);
  const [right, setRight] = useState<string>(text.exampleRight);

  const result = useMemo(() => {
    try {
      const leftFlat = flattenJson(JSON.parse(left));
      const rightFlat = flattenJson(JSON.parse(right));
      const keys = Array.from(new Set([...Object.keys(leftFlat), ...Object.keys(rightFlat)])).sort();
      const diff: DiffItem[] = [];

      keys.forEach((key) => {
        const hasLeft = key in leftFlat;
        const hasRight = key in rightFlat;
        if (!hasLeft && hasRight) {
          diff.push({ key, type: "added", after: rightFlat[key] });
          return;
        }
        if (hasLeft && !hasRight) {
          diff.push({ key, type: "removed", before: leftFlat[key] });
          return;
        }
        if (JSON.stringify(leftFlat[key]) !== JSON.stringify(rightFlat[key])) {
          diff.push({ key, type: "changed", before: leftFlat[key], after: rightFlat[key] });
        }
      });

      return { diff };
    } catch {
      return { error: text.invalid };
    }
  }, [left, right, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/json-diff-viewer</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="json-diff-left" className="block text-sm font-medium">{text.left}</label>
          <textarea id="json-diff-left" value={left} onChange={(event) => setLeft(event.target.value)} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="json-diff-right" className="block text-sm font-medium">{text.right}</label>
          <textarea id="json-diff-right" value={right} onChange={(event) => setRight(event.target.value)} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
      </div>
      <div className="space-y-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
        {"error" in result ? (
          <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
        ) : result.diff.length === 0 ? (
          <p className="text-sm text-[var(--terminal-muted)]">{text.none}</p>
        ) : (
          <div className="space-y-2">
            {result.diff.map((item) => (
              <div
                key={`${item.type}-${item.key}`}
                className={`rounded border px-3 py-3 ${
                  item.type === "added"
                    ? "border-emerald-500/30 bg-emerald-500/10"
                    : item.type === "removed"
                      ? "border-rose-500/30 bg-rose-500/10"
                      : "border-sky-500/30 bg-sky-500/10"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-mono text-sm text-[var(--terminal-accent)]">{item.key}</div>
                  <div className="text-xs font-mono text-[var(--terminal-muted)]">
                    {item.type === "added" ? text.added : item.type === "removed" ? text.removed : text.changed}
                  </div>
                </div>
                {item.before !== undefined && (
                  <div className="mt-2 text-xs font-mono text-[var(--foreground)]/75">before: {JSON.stringify(item.before)}</div>
                )}
                {item.after !== undefined && (
                  <div className="mt-1 text-xs font-mono text-[var(--foreground)]/75">after: {JSON.stringify(item.after)}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
