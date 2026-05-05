"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "estimate liquidation risk",
    collateralAmount: "Collateral amount",
    collateralPrice: "Collateral price",
    debtAmount: "Debt amount",
    liquidationThreshold: "Liquidation threshold (%)",
    collateralValue: "Collateral value",
    currentLtv: "Current LTV %",
    maxDebt: "Max safe debt",
    liquidationPrice: "Liquidation price",
    buffer: "Price buffer %",
    invalid: "Enter positive collateral amount and price, non-negative debt, and a threshold between 0 and 100.",
  },
  zh: {
    command: "estimate liquidation risk",
    collateralAmount: "抵押物数量",
    collateralPrice: "抵押物价格",
    debtAmount: "债务数量",
    liquidationThreshold: "清算阈值（%）",
    collateralValue: "抵押物总价值",
    currentLtv: "当前 LTV %",
    maxDebt: "最大安全债务",
    liquidationPrice: "清算价格",
    buffer: "价格缓冲 %",
    invalid: "请输入正数抵押物数量和价格、非负债务，以及 0 到 100 之间的清算阈值。",
  },
} as const;

function format(value: number) {
  return value.toFixed(8).replace(/\.?0+$/, "");
}

export default function LiquidationRiskCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [collateralAmount, setCollateralAmount] = useState<string>("10");
  const [collateralPrice, setCollateralPrice] = useState<string>("3000");
  const [debtAmount, setDebtAmount] = useState<string>("18000");
  const [liquidationThreshold, setLiquidationThreshold] = useState<string>("80");

  const result = useMemo(() => {
    const collateralAmountValue = Number.parseFloat(collateralAmount);
    const collateralPriceValue = Number.parseFloat(collateralPrice);
    const debtAmountValue = Number.parseFloat(debtAmount);
    const thresholdValue = Number.parseFloat(liquidationThreshold);

    if (
      ![collateralAmountValue, collateralPriceValue, debtAmountValue, thresholdValue].every(Number.isFinite) ||
      collateralAmountValue <= 0 ||
      collateralPriceValue <= 0 ||
      debtAmountValue < 0 ||
      thresholdValue <= 0 ||
      thresholdValue > 100
    ) {
      return { error: text.invalid };
    }

    const collateralValue = collateralAmountValue * collateralPriceValue;
    const currentLtv = collateralValue > 0 ? (debtAmountValue / collateralValue) * 100 : 0;
    const maxDebt = collateralValue * (thresholdValue / 100);
    const liquidationPrice = debtAmountValue > 0 ? debtAmountValue / (collateralAmountValue * (thresholdValue / 100)) : 0;
    const buffer = collateralPriceValue > 0 ? ((collateralPriceValue - liquidationPrice) / collateralPriceValue) * 100 : 0;

    return {
      collateralValue: format(collateralValue),
      currentLtv: format(currentLtv),
      maxDebt: format(maxDebt),
      liquidationPrice: format(liquidationPrice),
      buffer: format(buffer),
    };
  }, [collateralAmount, collateralPrice, debtAmount, liquidationThreshold, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/liquidation-risk-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        {([
          [text.collateralAmount, collateralAmount, setCollateralAmount],
          [text.collateralPrice, collateralPrice, setCollateralPrice],
          [text.debtAmount, debtAmount, setDebtAmount],
          [text.liquidationThreshold, liquidationThreshold, setLiquidationThreshold],
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
            [text.collateralValue, result.collateralValue],
            [text.currentLtv, result.currentLtv],
            [text.maxDebt, result.maxDebt],
            [text.liquidationPrice, result.liquidationPrice],
            [text.buffer, result.buffer],
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
