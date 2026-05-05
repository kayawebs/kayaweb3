"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "average stock cost",
    lots: "Lots (shares,price per line)",
    lotsHint: "Example: 10,150\n5,140\n8,160",
    marketPrice: "Current market price",
    totalShares: "Total shares",
    totalCost: "Total cost basis",
    averagePrice: "Average price",
    marketValue: "Market value",
    pnl: "Unrealized P/L",
    invalid: "Enter at least one valid lot in shares,price format. Shares and prices must be positive.",
  },
  zh: {
    command: "average stock cost",
    lots: "持仓批次（每行：股数,价格）",
    lotsHint: "示例：10,150\n5,140\n8,160",
    marketPrice: "当前市场价格",
    totalShares: "总股数",
    totalCost: "总持仓成本",
    averagePrice: "平均持仓价",
    marketValue: "当前市值",
    pnl: "浮动盈亏",
    invalid: "请至少输入一行合法的 股数,价格。股数和价格都必须为正数。",
  },
} as const;

function format(value: number, digits = 6) {
  return value.toFixed(digits).replace(/\.?0+$/, "");
}

function parseLots(input: string) {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [sharesRaw, priceRaw] = line.split(",").map((part) => part.trim());
      const shares = Number.parseFloat(sharesRaw ?? "");
      const price = Number.parseFloat(priceRaw ?? "");
      return { shares, price };
    })
    .filter(({ shares, price }) => Number.isFinite(shares) && shares > 0 && Number.isFinite(price) && price > 0);
}

export default function StockAveragePriceCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [lots, setLots] = useState("10,150\n5,140\n8,160");
  const [marketPrice, setMarketPrice] = useState("158");

  const result = useMemo(() => {
    const parsedLots = parseLots(lots);
    const livePrice = Number.parseFloat(marketPrice);

    if (parsedLots.length === 0) {
      return { error: text.invalid };
    }

    const totalShares = parsedLots.reduce((sum, lot) => sum + lot.shares, 0);
    const totalCost = parsedLots.reduce((sum, lot) => sum + lot.shares * lot.price, 0);
    const averagePrice = totalCost / totalShares;
    const hasMarketPrice = Number.isFinite(livePrice) && livePrice > 0;
    const marketValue = hasMarketPrice ? totalShares * livePrice : null;
    const pnl = hasMarketPrice && marketValue !== null ? marketValue - totalCost : null;

    return { totalShares, totalCost, averagePrice, marketValue, pnl };
  }, [lots, marketPrice, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/stock-average-price-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.8fr)]">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <span className="block text-sm font-medium">{text.lots}</span>
          <textarea
            value={lots}
            onChange={(event) => setLots(event.target.value)}
            rows={10}
            placeholder={text.lotsHint}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
        </label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <span className="block text-sm font-medium">{text.marketPrice}</span>
          <input
            type="text"
            value={marketPrice}
            onChange={(event) => setMarketPrice(event.target.value)}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
        </label>
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-5">
          {([
            [text.totalShares, format(result.totalShares)],
            [text.totalCost, format(result.totalCost, 2)],
            [text.averagePrice, format(result.averagePrice, 6)],
            [text.marketValue, result.marketValue === null ? "n/a" : format(result.marketValue, 2)],
            [text.pnl, result.pnl === null ? "n/a" : format(result.pnl, 2)],
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
