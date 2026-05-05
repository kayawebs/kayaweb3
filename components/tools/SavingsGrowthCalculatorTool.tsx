"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "project savings growth",
    initial: "Initial savings",
    monthly: "Monthly contribution",
    annualRate: "Annual return (%)",
    years: "Years",
    finalBalance: "Final balance",
    totalContributed: "Total contributed",
    totalGrowth: "Investment growth",
    invalid: "Enter non-negative savings and contributions, plus non-negative rate and years.",
  },
  zh: {
    command: "project savings growth",
    initial: "初始存款",
    monthly: "每月追加",
    annualRate: "年化收益率（%）",
    years: "年数",
    finalBalance: "最终余额",
    totalContributed: "总投入",
    totalGrowth: "收益增长",
    invalid: "请输入非负的初始存款、每月追加、收益率和年数。",
  },
} as const;

function format(value: number) {
  return value.toFixed(2).replace(/\.?0+$/, "");
}

export default function SavingsGrowthCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [initial, setInitial] = useState<string>("5000");
  const [monthly, setMonthly] = useState<string>("200");
  const [annualRate, setAnnualRate] = useState<string>("5");
  const [years, setYears] = useState<string>("15");

  const result = useMemo(() => {
    const initialValue = Number.parseFloat(initial);
    const monthlyValue = Number.parseFloat(monthly);
    const annualRateValue = Number.parseFloat(annualRate);
    const yearsValue = Number.parseFloat(years);
    if (
      !Number.isFinite(initialValue) ||
      !Number.isFinite(monthlyValue) ||
      !Number.isFinite(annualRateValue) ||
      !Number.isFinite(yearsValue) ||
      initialValue < 0 ||
      monthlyValue < 0 ||
      annualRateValue < 0 ||
      yearsValue < 0
    ) {
      return { error: text.invalid };
    }

    const monthlyRate = annualRateValue / 100 / 12;
    const months = Math.round(yearsValue * 12);
    let balance = initialValue;
    for (let month = 0; month < months; month += 1) {
      balance = balance * (1 + monthlyRate) + monthlyValue;
    }

    const totalContributed = initialValue + monthlyValue * months;
    return {
      finalBalance: format(balance),
      totalContributed: format(totalContributed),
      totalGrowth: format(balance - totalContributed),
    };
  }, [annualRate, initial, monthly, text.invalid, years]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/savings-growth-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        {([
          [text.initial, initial, setInitial],
          [text.monthly, monthly, setMonthly],
          [text.annualRate, annualRate, setAnnualRate],
          [text.years, years, setYears],
        ] as const).map(([label, value, setter]) => (
          <label key={label} className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <span className="block text-sm font-medium">{label}</span>
            <input type="text" value={value} onChange={(event) => setter(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
          </label>
        ))}
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {([
            [text.finalBalance, result.finalBalance],
            [text.totalContributed, result.totalContributed],
            [text.totalGrowth, result.totalGrowth],
          ] as const).map(([label, value]) => (
            <div key={label} className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
              <div className="text-sm font-medium">{label}</div>
              <textarea readOnly value={value} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
