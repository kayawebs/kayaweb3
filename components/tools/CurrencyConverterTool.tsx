"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "convert currency",
    amount: "Amount",
    fromCurrency: "From currency",
    toCurrency: "To currency",
    rate: "Exchange rate",
    converted: "Converted amount",
    inverseRate: "Inverse rate",
    invalid: "Enter a valid amount and a positive exchange rate.",
  },
  zh: {
    command: "convert currency",
    amount: "金额",
    fromCurrency: "原币种",
    toCurrency: "目标币种",
    rate: "汇率",
    converted: "转换结果",
    inverseRate: "反向汇率",
    invalid: "请输入合法金额和正数汇率。",
  },
} as const;

function format(value: number) {
  return value.toFixed(8).replace(/\.?0+$/, "");
}

export default function CurrencyConverterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [amount, setAmount] = useState<string>("100");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [rate, setRate] = useState<string>("0.92");

  const result = useMemo(() => {
    const amountValue = Number.parseFloat(amount);
    const rateValue = Number.parseFloat(rate);
    if (!Number.isFinite(amountValue) || !Number.isFinite(rateValue) || rateValue <= 0) {
      return { error: text.invalid };
    }

    return {
      converted: `${format(amountValue * rateValue)} ${toCurrency.trim().toUpperCase() || "?"}`,
      inverseRate: `1 ${toCurrency.trim().toUpperCase() || "?"} = ${format(1 / rateValue)} ${fromCurrency.trim().toUpperCase() || "?"}`,
    };
  }, [amount, fromCurrency, rate, text.invalid, toCurrency]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/currency-converter</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        {([
          [text.amount, amount, setAmount],
          [text.fromCurrency, fromCurrency, setFromCurrency],
          [text.toCurrency, toCurrency, setToCurrency],
          [text.rate, rate, setRate],
        ] as const).map(([label, value, setter]) => (
          <label key={label} className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <span className="block text-sm font-medium">{label}</span>
            <input
              type="text"
              value={value}
              onChange={(event) => setter(event.target.value)}
              className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm uppercase outline-none focus:border-[var(--terminal-accent)]"
            />
          </label>
        ))}
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.converted}</div>
            <textarea readOnly value={result.converted} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.inverseRate}</div>
            <textarea readOnly value={result.inverseRate} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          </div>
        </div>
      )}
    </section>
  );
}
