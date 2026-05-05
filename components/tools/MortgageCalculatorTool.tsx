"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "home loan",
    homePrice: "Home price",
    downPayment: "Down payment",
    rate: "Annual rate %",
    years: "Mortgage years",
    invalid: "Enter valid numbers. Home price and years must be above 0, and down payment cannot exceed home price.",
  },
  zh: {
    command: "home loan",
    homePrice: "房价",
    downPayment: "首付",
    rate: "年利率 %",
    years: "按揭年数",
    invalid: "请输入合法数字。房价和年数必须大于 0，首付不能超过房价。",
  },
} as const;

function amortizedPayment(loan: number, annualRate: number, months: number) {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return loan / months;
  return (loan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

export default function MortgageCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [homePrice, setHomePrice] = useState("500000");
  const [downPayment, setDownPayment] = useState("100000");
  const [rate, setRate] = useState("6");
  const [years, setYears] = useState("30");

  const result = useMemo(() => {
    const hp = Number(homePrice || 0);
    const dp = Number(downPayment || 0);
    const r = Number(rate || 0);
    const y = Number(years || 0);
    if (![hp, dp, r, y].every(Number.isFinite) || hp <= 0 || y <= 0 || dp < 0 || dp > hp || r < 0) return { error: text.invalid };
    const loan = hp - dp;
    const months = Math.round(y * 12);
    const monthlyPayment = amortizedPayment(loan, r, months);
    const totalPaid = monthlyPayment * months + dp;
    return {
      loan,
      monthlyPayment,
      totalInterest: monthlyPayment * months - loan,
      totalPaid,
    };
  }, [downPayment, homePrice, rate, years, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/mortgage-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.homePrice}</span><input value={homePrice} onChange={(e) => setHomePrice(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.downPayment}</span><input value={downPayment} onChange={(e) => setDownPayment(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.rate}</span><input value={rate} onChange={(e) => setRate(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.years}</span><input value={years} onChange={(e) => setYears(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">Loan principal</div><div className="mt-1 font-mono text-sm">{result.loan.toFixed(2)}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">Monthly payment</div><div className="mt-1 font-mono text-sm">{result.monthlyPayment.toFixed(2)}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">Total interest</div><div className="mt-1 font-mono text-sm">{result.totalInterest.toFixed(2)}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">Total paid incl. down payment</div><div className="mt-1 font-mono text-sm">{result.totalPaid.toFixed(2)}</div></div>
        </div>
      )}
    </section>
  );
}
