"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "pnl",
    cost: "Cost price",
    sell: "Sell price",
    quantity: "Quantity",
    invalid: "Enter valid numbers. Cost and quantity must be above 0.",
  },
  zh: {
    command: "pnl",
    cost: "成本价",
    sell: "卖出价",
    quantity: "数量",
    invalid: "请输入合法数字，成本价和数量必须大于 0。",
  },
} as const;

export default function ProfitLossCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [cost, setCost] = useState("100");
  const [sell, setSell] = useState("125");
  const [quantity, setQuantity] = useState("10");

  const result = useMemo(() => {
    const c = Number(cost || 0);
    const s = Number(sell || 0);
    const q = Number(quantity || 0);
    if (![c, s, q].every(Number.isFinite) || c <= 0 || q <= 0) return { error: text.invalid };
    const perUnit = s - c;
    const total = perUnit * q;
    const percent = (perUnit / c) * 100;
    return { perUnit, total, percent };
  }, [cost, quantity, sell, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/profit-loss-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.cost}</span><input value={cost} onChange={(e) => setCost(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.sell}</span><input value={sell} onChange={(e) => setSell(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.quantity}</span><input value={quantity} onChange={(e) => setQuantity(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">Per unit</div><div className="mt-1 font-mono text-sm">{result.perUnit.toFixed(2)}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">Total</div><div className="mt-1 font-mono text-sm">{result.total.toFixed(2)}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">Margin vs cost</div><div className="mt-1 font-mono text-sm">{result.percent.toFixed(2)}%</div></div>
        </div>
      )}
    </section>
  );
}
