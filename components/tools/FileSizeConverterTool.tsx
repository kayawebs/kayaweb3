"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const UNITS = ["B", "KB", "MB", "GB", "TB"] as const;

const TEXT = {
  en: {
    command: "convert size",
    value: "Value",
    unit: "Unit",
    output: "Converted values",
    invalid: "Enter a non-negative number.",
  },
  zh: {
    command: "convert size",
    value: "数值",
    unit: "单位",
    output: "换算结果",
    invalid: "请输入非负数值。",
  },
} as const;

export default function FileSizeConverterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [value, setValue] = useState("15");
  const [unit, setUnit] = useState<(typeof UNITS)[number]>("MB");

  const result = useMemo(() => {
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed) || parsed < 0) return { error: text.invalid };
    const bytes = parsed * 1024 ** UNITS.indexOf(unit);
    return {
      values: UNITS.map((target) => `${target}: ${(bytes / 1024 ** UNITS.indexOf(target)).toFixed(6).replace(/\.?0+$/, "")}`),
    };
  }, [text.invalid, unit, value]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/file-size-converter</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <span className="block text-sm font-medium">{text.value}</span>
          <input value={value} onChange={(event) => setValue(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <span className="block text-sm font-medium">{text.unit}</span>
          <select value={unit} onChange={(event) => setUnit(event.target.value as (typeof UNITS)[number])} className="w-full rounded border border-[var(--terminal-border)] bg-[var(--background)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]">
            {UNITS.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <div className="text-sm font-medium">{text.output}</div>
        {"error" in result ? (
          <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
        ) : (
          <textarea readOnly value={result.values.join("\n")} rows={10} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
        )}
      </div>
    </section>
  );
}
