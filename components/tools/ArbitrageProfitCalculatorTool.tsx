"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "estimate arb profit",
    capital: "Starting capital",
    buyPrice: "Buy price",
    sellPrice: "Sell price",
    buyFee: "Buy fee (%)",
    sellFee: "Sell fee (%)",
    slippage: "Extra slippage (%)",
    networkCost: "Network / transfer cost",
    units: "Estimated units bought",
    proceeds: "Estimated sale proceeds",
    profit: "Net profit",
    roi: "ROI %",
    breakEven: "Break-even sell price",
    invalid: "Enter positive capital and prices, plus non-negative fee, slippage, and network cost values.",
  },
  zh: {
    command: "estimate arb profit",
    capital: "起始资金",
    buyPrice: "买入价格",
    sellPrice: "卖出价格",
    buyFee: "买入手续费（%）",
    sellFee: "卖出手续费（%）",
    slippage: "额外滑点（%）",
    networkCost: "链上 / 转账成本",
    units: "预估买入数量",
    proceeds: "预估卖出回收",
    profit: "净利润",
    roi: "ROI %",
    breakEven: "盈亏平衡卖价",
    invalid: "请输入正数资金和价格，以及非负的手续费、滑点和网络成本。",
  },
} as const;

function format(value: number) {
  return value.toFixed(8).replace(/\.?0+$/, "");
}

export default function ArbitrageProfitCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [capital, setCapital] = useState<string>("10000");
  const [buyPrice, setBuyPrice] = useState<string>("100");
  const [sellPrice, setSellPrice] = useState<string>("103");
  const [buyFee, setBuyFee] = useState<string>("0.1");
  const [sellFee, setSellFee] = useState<string>("0.1");
  const [slippage, setSlippage] = useState<string>("0.2");
  const [networkCost, setNetworkCost] = useState<string>("20");

  const result = useMemo(() => {
    const capitalValue = Number.parseFloat(capital);
    const buyPriceValue = Number.parseFloat(buyPrice);
    const sellPriceValue = Number.parseFloat(sellPrice);
    const buyFeeValue = Number.parseFloat(buyFee);
    const sellFeeValue = Number.parseFloat(sellFee);
    const slippageValue = Number.parseFloat(slippage);
    const networkCostValue = Number.parseFloat(networkCost);

    if (
      ![capitalValue, buyPriceValue, sellPriceValue, buyFeeValue, sellFeeValue, slippageValue, networkCostValue].every(Number.isFinite) ||
      capitalValue <= 0 ||
      buyPriceValue <= 0 ||
      sellPriceValue <= 0 ||
      buyFeeValue < 0 ||
      sellFeeValue < 0 ||
      slippageValue < 0 ||
      networkCostValue < 0
    ) {
      return { error: text.invalid };
    }

    const buyCostPerUnit = buyPriceValue * (1 + buyFeeValue / 100);
    const units = capitalValue / buyCostPerUnit;
    const effectiveSellPrice = sellPriceValue * (1 - sellFeeValue / 100) * (1 - slippageValue / 100);
    const proceeds = units * effectiveSellPrice;
    const profit = proceeds - capitalValue - networkCostValue;
    const roi = (profit / capitalValue) * 100;
    const breakEvenSellPrice = (capitalValue + networkCostValue) / units / ((1 - sellFeeValue / 100) * (1 - slippageValue / 100));

    return {
      units: format(units),
      proceeds: format(proceeds),
      profit: format(profit),
      roi: format(roi),
      breakEven: format(breakEvenSellPrice),
    };
  }, [buyFee, buyPrice, capital, networkCost, sellFee, sellPrice, slippage, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/arbitrage-profit-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        {([
          [text.capital, capital, setCapital],
          [text.buyPrice, buyPrice, setBuyPrice],
          [text.sellPrice, sellPrice, setSellPrice],
          [text.buyFee, buyFee, setBuyFee],
          [text.sellFee, sellFee, setSellFee],
          [text.slippage, slippage, setSlippage],
          [text.networkCost, networkCost, setNetworkCost],
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
        <div className="grid gap-4 lg:grid-cols-5">
          {([
            [text.units, result.units],
            [text.proceeds, result.proceeds],
            [text.profit, result.profit],
            [text.roi, result.roi],
            [text.breakEven, result.breakEven],
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
