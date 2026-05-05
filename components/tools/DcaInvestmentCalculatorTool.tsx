"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "calculate dca",
    amountPerBuy: "Amount per buy",
    currentPrice: "Current price",
    priceHistory: "Buy prices (one per line)",
    priceHistoryHint: "Example: 100\n95\n90\n110",
    invested: "Total invested",
    units: "Total units accumulated",
    averageCost: "Average cost per unit",
    currentValue: "Current value",
    pnl: "Profit / loss",
    invalid: "Enter a positive buy amount, a positive current price, and at least one positive buy price.",
  },
  zh: {
    command: "calculate dca",
    amountPerBuy: "每次投入金额",
    currentPrice: "当前价格",
    priceHistory: "买入价格列表（每行一个）",
    priceHistoryHint: "示例：100\n95\n90\n110",
    invested: "总投入",
    units: "累计持仓数量",
    averageCost: "平均持仓成本",
    currentValue: "当前市值",
    pnl: "盈亏",
    invalid: "请输入正数的每次投入金额、当前价格，以及至少一个正数买入价格。",
  },
} as const;

function format(value: number, digits = 6) {
  return value.toFixed(digits).replace(/\.?0+$/, "");
}

function parsePriceLines(input: string) {
  return input
    .split(/\r?\n/)
    .map((line) => Number.parseFloat(line.trim()))
    .filter((value) => Number.isFinite(value) && value > 0);
}

export default function DcaInvestmentCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [amountPerBuy, setAmountPerBuy] = useState("500");
  const [currentPrice, setCurrentPrice] = useState("108");
  const [priceHistory, setPriceHistory] = useState("100\n95\n90\n110");

  const result = useMemo(() => {
    const amount = Number.parseFloat(amountPerBuy);
    const marketPrice = Number.parseFloat(currentPrice);
    const buys = parsePriceLines(priceHistory);

    if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(marketPrice) || marketPrice <= 0 || buys.length === 0) {
      return { error: text.invalid };
    }

    const totalInvested = amount * buys.length;
    const totalUnits = buys.reduce((sum, price) => sum + amount / price, 0);
    const averageCost = totalInvested / totalUnits;
    const currentValue = totalUnits * marketPrice;
    const pnl = currentValue - totalInvested;

    return {
      totalInvested,
      totalUnits,
      averageCost,
      currentValue,
      pnl,
    };
  }, [amountPerBuy, currentPrice, priceHistory, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/dca-investment-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <span className="block text-sm font-medium">{text.amountPerBuy}</span>
          <input
            type="text"
            value={amountPerBuy}
            onChange={(event) => setAmountPerBuy(event.target.value)}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
        </label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <span className="block text-sm font-medium">{text.currentPrice}</span>
          <input
            type="text"
            value={currentPrice}
            onChange={(event) => setCurrentPrice(event.target.value)}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
        </label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <span className="block text-sm font-medium">{text.priceHistory}</span>
          <textarea
            value={priceHistory}
            onChange={(event) => setPriceHistory(event.target.value)}
            rows={8}
            placeholder={text.priceHistoryHint}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
        </label>
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-5">
          {([
            [text.invested, format(result.totalInvested, 2)],
            [text.units, format(result.totalUnits)],
            [text.averageCost, format(result.averageCost, 6)],
            [text.currentValue, format(result.currentValue, 2)],
            [text.pnl, format(result.pnl, 2)],
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
