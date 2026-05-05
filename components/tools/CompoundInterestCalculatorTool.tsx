"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "fv = p(1+r/n)^(nt)",
    principal: "Principal",
    rate: "Annual rate %",
    years: "Years",
    compounds: "Compounds / year",
    contribution: "Monthly contribution",
    invalid: "Enter valid numbers. Principal, years, and compounds must not be negative, and compounds must be above 0.",
  },
  zh: {
    command: "fv = p(1+r/n)^(nt)",
    principal: "本金",
    rate: "年利率 %",
    years: "年数",
    compounds: "每年复利次数",
    contribution: "每月追加",
    invalid: "请输入合法数字。本金、年数不能为负，复利次数必须大于 0。",
  },
} as const;

export default function CompoundInterestCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("10");
  const [compounds, setCompounds] = useState("12");
  const [contribution, setContribution] = useState("200");

  const result = useMemo(() => {
    const p = Number(principal || 0);
    const r = Number(rate || 0) / 100;
    const y = Number(years || 0);
    const n = Number(compounds || 0);
    const c = Number(contribution || 0);
    if (![p, r, y, n, c].every(Number.isFinite) || p < 0 || y < 0 || n <= 0 || c < 0) return { error: text.invalid };
    const growthFactor = Math.pow(1 + r / n, n * y);
    const futurePrincipal = p * growthFactor;
    const monthlyRate = r / 12;
    const monthlyPeriods = y * 12;
    const futureContributions =
      monthlyRate === 0
        ? c * monthlyPeriods
        : c * ((Math.pow(1 + monthlyRate, monthlyPeriods) - 1) / monthlyRate);
    const totalContributed = p + c * monthlyPeriods;
    const futureValue = futurePrincipal + futureContributions;
    return {
      futureValue,
      interestEarned: futureValue - totalContributed,
      totalContributed,
    };
  }, [compounds, contribution, principal, rate, text.invalid, years]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/compound-interest-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.principal}</span><input value={principal} onChange={(e) => setPrincipal(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.rate}</span><input value={rate} onChange={(e) => setRate(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.years}</span><input value={years} onChange={(e) => setYears(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.compounds}</span><input value={compounds} onChange={(e) => setCompounds(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.contribution}</span><input value={contribution} onChange={(e) => setContribution(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">Future value</div><div className="mt-1 font-mono text-sm">{result.futureValue.toFixed(2)}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">Total contributed</div><div className="mt-1 font-mono text-sm">{result.totalContributed.toFixed(2)}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">Interest earned</div><div className="mt-1 font-mono text-sm">{result.interestEarned.toFixed(2)}</div></div>
        </div>
      )}
    </section>
  );
}
