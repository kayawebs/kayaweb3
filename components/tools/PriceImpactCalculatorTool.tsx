"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "estimate impact",
    reserveIn: "Pool reserve in",
    reserveOut: "Pool reserve out",
    amountIn: "Trade amount in",
    feeBps: "Fee (bps)",
    actualOut: "Actual output",
    idealOut: "Ideal output",
    impact: "Price impact %",
    execution: "Execution price",
    spot: "Spot price",
    postTrade: "Post-trade spot price",
    invalid: "Enter positive reserves, a non-negative trade size, and fee bps between 0 and 10000.",
  },
  zh: {
    command: "estimate impact",
    reserveIn: "池子输入储备",
    reserveOut: "池子输出储备",
    amountIn: "交易输入数量",
    feeBps: "手续费（bps）",
    actualOut: "实际输出",
    idealOut: "理想输出",
    impact: "价格影响 %",
    execution: "成交价格",
    spot: "当前现货价格",
    postTrade: "交易后现货价格",
    invalid: "请输入正数储备、非负交易数量，以及 0 到 10000 之间的手续费 bps。",
  },
} as const;

function formatNumber(value: number) {
  return Number.isFinite(value) ? value.toFixed(8).replace(/\.?0+$/, "") : "";
}

export default function PriceImpactCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [reserveIn, setReserveIn] = useState<string>("100");
  const [reserveOut, setReserveOut] = useState<string>("200000");
  const [amountIn, setAmountIn] = useState<string>("1");
  const [feeBps, setFeeBps] = useState<string>("30");

  const result = useMemo(() => {
    const reserveInValue = Number.parseFloat(reserveIn);
    const reserveOutValue = Number.parseFloat(reserveOut);
    const amountInValue = Number.parseFloat(amountIn);
    const feeBpsValue = Number.parseFloat(feeBps);

    if (
      !Number.isFinite(reserveInValue) ||
      !Number.isFinite(reserveOutValue) ||
      !Number.isFinite(amountInValue) ||
      !Number.isFinite(feeBpsValue) ||
      reserveInValue <= 0 ||
      reserveOutValue <= 0 ||
      amountInValue < 0 ||
      feeBpsValue < 0 ||
      feeBpsValue > 10000
    ) {
      return { error: text.invalid };
    }

    const feeMultiplier = 1 - feeBpsValue / 10000;
    const effectiveAmountIn = amountInValue * feeMultiplier;
    const idealOut = reserveOutValue * (amountInValue / reserveInValue);
    const actualOut = (reserveOutValue * effectiveAmountIn) / (reserveInValue + effectiveAmountIn);
    const impact = idealOut > 0 ? ((idealOut - actualOut) / idealOut) * 100 : 0;
    const spotPrice = reserveOutValue / reserveInValue;
    const executionPrice = actualOut > 0 && amountInValue > 0 ? actualOut / amountInValue : 0;
    const postTradePrice = (reserveOutValue - actualOut) / (reserveInValue + effectiveAmountIn);

    return {
      idealOut: formatNumber(idealOut),
      actualOut: formatNumber(actualOut),
      impact: formatNumber(impact),
      spotPrice: formatNumber(spotPrice),
      executionPrice: formatNumber(executionPrice),
      postTradePrice: formatNumber(postTradePrice),
    };
  }, [amountIn, feeBps, reserveIn, reserveOut, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/price-impact-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        {([
          ["price-impact-reserve-in", text.reserveIn, reserveIn, setReserveIn],
          ["price-impact-reserve-out", text.reserveOut, reserveOut, setReserveOut],
          ["price-impact-amount-in", text.amountIn, amountIn, setAmountIn],
          ["price-impact-fee-bps", text.feeBps, feeBps, setFeeBps],
        ] as const).map(([id, label, value, setter]) => (
          <label key={id} htmlFor={id} className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <span className="block text-sm font-medium">{label}</span>
            <input
              id={id}
              type="text"
              value={value}
              onChange={(event) => setter(event.target.value)}
              className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
            />
          </label>
        ))}
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {([
            [text.idealOut, result.idealOut],
            [text.actualOut, result.actualOut],
            [text.impact, result.impact],
            [text.spot, result.spotPrice],
            [text.execution, result.executionPrice],
            [text.postTrade, result.postTradePrice],
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
