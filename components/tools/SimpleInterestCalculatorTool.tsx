"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "interest = p * r * t",
    principal: "Principal",
    rate: "Annual rate %",
    years: "Years",
    invalid: "Enter valid numbers. Principal, rate, and years must not be negative.",
  },
  zh: {
    command: "interest = p * r * t",
    principal: "本金",
    rate: "年利率 %",
    years: "年数",
    invalid: "请输入合法数字。本金、利率和年数不能为负。",
  },
} as const;

export default function SimpleInterestCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [principal, setPrincipal] = useState("1000");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("3");

  const result = useMemo(() => {
    const p = Number(principal || 0);
    const r = Number(rate || 0);
    const y = Number(years || 0);
    if (![p, r, y].every(Number.isFinite) || p < 0 || r < 0 || y < 0) return { error: text.invalid };
    const interest = p * (r / 100) * y;
    return {
      interest,
      totalAmount: p + interest,
    };
  }, [principal, rate, years, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/simple-interest-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.principal}</span><input value={principal} onChange={(e) => setPrincipal(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.rate}</span><input value={rate} onChange={(e) => setRate(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.years}</span><input value={years} onChange={(e) => setYears(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">Interest</div><div className="mt-1 font-mono text-sm">{result.interest.toFixed(2)}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">Total amount</div><div className="mt-1 font-mono text-sm">{result.totalAmount.toFixed(2)}</div></div>
        </div>
      )}
    </section>
  );
}
