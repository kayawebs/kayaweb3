"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "bc",
    value: "Value",
    total: "Total",
    percent: "Percent",
    result: "Results",
    invalid: "Enter valid numbers. Total cannot be zero where division is required.",
  },
  zh: {
    command: "bc",
    value: "数值",
    total: "总量",
    percent: "百分比",
    result: "结果",
    invalid: "请输入合法数字。涉及除法时总量不能为 0。",
  },
} as const;

export default function PercentageCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [value, setValue] = useState("25");
  const [total, setTotal] = useState("200");
  const [percent, setPercent] = useState("15");

  const result = useMemo(() => {
    const v = Number(value || 0);
    const t = Number(total || 0);
    const p = Number(percent || 0);
    if (![v, t, p].every(Number.isFinite)) return { error: text.invalid };
    if (t === 0) return { error: text.invalid };
    return {
      valueAsPercentOfTotal: (v / t) * 100,
      percentOfTotal: (p / 100) * t,
      whatTotalFromValueAndPercent: p === 0 ? null : v / (p / 100),
    };
  }, [percent, text.invalid, total, value]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/percentage-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.value}</span><input value={value} onChange={(e) => setValue(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.total}</span><input value={total} onChange={(e) => setTotal(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.percent}</span><input value={percent} onChange={(e) => setPercent(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{`${value} / ${total}`}</div><div className="mt-1 font-mono text-sm">{result.valueAsPercentOfTotal.toFixed(2)}%</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{`${percent}% of ${total}`}</div><div className="mt-1 font-mono text-sm">{result.percentOfTotal.toFixed(2)}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{`${value} is ${percent}% of ?`}</div><div className="mt-1 font-mono text-sm">{result.whatTotalFromValueAndPercent === null ? "n/a" : result.whatTotalFromValueAndPercent.toFixed(2)}</div></div>
        </div>
      )}
    </section>
  );
}
