"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "payment = P*r/(1-(1+r)^-n)",
    loan: "Loan amount",
    rate: "Annual rate %",
    years: "Loan years",
    invalid: "Enter valid numbers. Loan and years must be above 0, and rate cannot be negative.",
  },
  zh: {
    command: "payment = P*r/(1-(1+r)^-n)",
    loan: "贷款金额",
    rate: "年利率 %",
    years: "贷款年数",
    invalid: "请输入合法数字。贷款金额和年数必须大于 0，利率不能为负。",
  },
} as const;

function amortizedPayment(loan: number, annualRate: number, months: number) {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return loan / months;
  return (loan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

export default function LoanPaymentCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [loan, setLoan] = useState("250000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("5");

  const result = useMemo(() => {
    const l = Number(loan || 0);
    const r = Number(rate || 0);
    const y = Number(years || 0);
    if (![l, r, y].every(Number.isFinite) || l <= 0 || y <= 0 || r < 0) return { error: text.invalid };
    const months = Math.round(y * 12);
    const monthlyPayment = amortizedPayment(l, r, months);
    const totalPaid = monthlyPayment * months;
    return {
      monthlyPayment,
      totalPaid,
      totalInterest: totalPaid - l,
    };
  }, [loan, rate, years, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/loan-payment-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.loan}</span><input value={loan} onChange={(e) => setLoan(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.rate}</span><input value={rate} onChange={(e) => setRate(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.years}</span><input value={years} onChange={(e) => setYears(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">Monthly payment</div><div className="mt-1 font-mono text-sm">{result.monthlyPayment.toFixed(2)}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">Total paid</div><div className="mt-1 font-mono text-sm">{result.totalPaid.toFixed(2)}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">Total interest</div><div className="mt-1 font-mono text-sm">{result.totalInterest.toFixed(2)}</div></div>
        </div>
      )}
    </section>
  );
}
