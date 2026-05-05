"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "calculate margin",
    revenue: "Revenue",
    expenses: "Expenses",
    netProfit: "Net profit",
    margin: "Net profit margin %",
    invalid: "Enter a positive revenue and non-negative expenses.",
  },
  zh: {
    command: "calculate margin",
    revenue: "营收",
    expenses: "支出",
    netProfit: "净利润",
    margin: "净利润率 %",
    invalid: "请输入正数营收和非负支出。",
  },
} as const;

function format(value: number) {
  return value.toFixed(2).replace(/\.?0+$/, "");
}

export default function NetProfitMarginCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [revenue, setRevenue] = useState<string>("10000");
  const [expenses, setExpenses] = useState<string>("7500");

  const result = useMemo(() => {
    const revenueValue = Number.parseFloat(revenue);
    const expensesValue = Number.parseFloat(expenses);
    if (!Number.isFinite(revenueValue) || !Number.isFinite(expensesValue) || revenueValue <= 0 || expensesValue < 0) {
      return { error: text.invalid };
    }

    const netProfit = revenueValue - expensesValue;
    return {
      netProfit: format(netProfit),
      margin: format((netProfit / revenueValue) * 100),
    };
  }, [expenses, revenue, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/net-profit-margin-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {([
          [text.revenue, revenue, setRevenue],
          [text.expenses, expenses, setExpenses],
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
        <div className="grid gap-4 lg:grid-cols-2">
          {([
            [text.netProfit, result.netProfit],
            [text.margin, result.margin],
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
