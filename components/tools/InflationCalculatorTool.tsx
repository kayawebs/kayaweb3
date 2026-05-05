"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "adjust for inflation",
    amount: "Starting amount",
    inflationRate: "Annual inflation (%)",
    years: "Years",
    futureCost: "Future equivalent cost",
    purchasingPower: "Remaining purchasing power",
    cumulative: "Cumulative inflation %",
    invalid: "Enter a positive amount, a non-negative inflation rate, and non-negative years.",
  },
  zh: {
    command: "adjust for inflation",
    amount: "起始金额",
    inflationRate: "年通胀率（%）",
    years: "年数",
    futureCost: "未来等值成本",
    purchasingPower: "剩余购买力",
    cumulative: "累计通胀 %",
    invalid: "请输入正数金额、非负通胀率和非负年数。",
  },
} as const;

function format(value: number) {
  return value.toFixed(2).replace(/\.?0+$/, "");
}

export default function InflationCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [amount, setAmount] = useState<string>("1000");
  const [inflationRate, setInflationRate] = useState<string>("3");
  const [years, setYears] = useState<string>("10");

  const result = useMemo(() => {
    const amountValue = Number.parseFloat(amount);
    const rateValue = Number.parseFloat(inflationRate);
    const yearsValue = Number.parseFloat(years);
    if (
      !Number.isFinite(amountValue) ||
      !Number.isFinite(rateValue) ||
      !Number.isFinite(yearsValue) ||
      amountValue <= 0 ||
      rateValue < 0 ||
      yearsValue < 0
    ) {
      return { error: text.invalid };
    }

    const multiplier = (1 + rateValue / 100) ** yearsValue;
    const futureCost = amountValue * multiplier;
    const purchasingPower = amountValue / multiplier;

    return {
      futureCost: format(futureCost),
      purchasingPower: format(purchasingPower),
      cumulative: format((multiplier - 1) * 100),
    };
  }, [amount, inflationRate, years, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/inflation-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {([
          [text.amount, amount, setAmount],
          [text.inflationRate, inflationRate, setInflationRate],
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
            [text.futureCost, result.futureCost],
            [text.purchasingPower, result.purchasingPower],
            [text.cumulative, result.cumulative],
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
