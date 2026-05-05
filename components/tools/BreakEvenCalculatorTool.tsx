"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "find break even",
    fixedCosts: "Fixed costs",
    pricePerUnit: "Price per unit",
    variableCost: "Variable cost per unit",
    breakEvenUnits: "Break-even units",
    contribution: "Contribution margin per unit",
    revenueAtBreakEven: "Break-even revenue",
    invalid: "Enter non-negative fixed costs and positive unit price greater than variable cost.",
  },
  zh: {
    command: "find break even",
    fixedCosts: "固定成本",
    pricePerUnit: "单价",
    variableCost: "单位变动成本",
    breakEvenUnits: "盈亏平衡销量",
    contribution: "单位贡献利润",
    revenueAtBreakEven: "盈亏平衡营收",
    invalid: "请输入非负固定成本，以及高于单位变动成本的正数单价。",
  },
} as const;

function format(value: number) {
  return value.toFixed(2).replace(/\.?0+$/, "");
}

export default function BreakEvenCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [fixedCosts, setFixedCosts] = useState<string>("10000");
  const [pricePerUnit, setPricePerUnit] = useState<string>("50");
  const [variableCost, setVariableCost] = useState<string>("30");

  const result = useMemo(() => {
    const fixedCostsValue = Number.parseFloat(fixedCosts);
    const pricePerUnitValue = Number.parseFloat(pricePerUnit);
    const variableCostValue = Number.parseFloat(variableCost);
    if (
      !Number.isFinite(fixedCostsValue) ||
      !Number.isFinite(pricePerUnitValue) ||
      !Number.isFinite(variableCostValue) ||
      fixedCostsValue < 0 ||
      pricePerUnitValue <= 0 ||
      variableCostValue < 0 ||
      pricePerUnitValue <= variableCostValue
    ) {
      return { error: text.invalid };
    }

    const contribution = pricePerUnitValue - variableCostValue;
    const breakEvenUnits = fixedCostsValue / contribution;
    const revenueAtBreakEven = breakEvenUnits * pricePerUnitValue;

    return {
      breakEvenUnits: format(breakEvenUnits),
      contribution: format(contribution),
      revenueAtBreakEven: format(revenueAtBreakEven),
    };
  }, [fixedCosts, pricePerUnit, text.invalid, variableCost]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/break-even-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {([
          [text.fixedCosts, fixedCosts, setFixedCosts],
          [text.pricePerUnit, pricePerUnit, setPricePerUnit],
          [text.variableCost, variableCost, setVariableCost],
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
            [text.breakEvenUnits, result.breakEvenUnits],
            [text.contribution, result.contribution],
            [text.revenueAtBreakEven, result.revenueAtBreakEven],
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
