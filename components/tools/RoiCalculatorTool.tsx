"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "roi",
    investment: "Investment cost",
    returnValue: "Return value",
    invalid: "Enter valid numbers. Investment cost must be above 0.",
  },
  zh: {
    command: "roi",
    investment: "投入成本",
    returnValue: "回报价值",
    invalid: "请输入合法数字，投入成本必须大于 0。",
  },
} as const;

export default function RoiCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [investment, setInvestment] = useState("1000");
  const [returnValue, setReturnValue] = useState("1350");

  const result = useMemo(() => {
    const i = Number(investment || 0);
    const r = Number(returnValue || 0);
    if (![i, r].every(Number.isFinite) || i <= 0) return { error: text.invalid };
    const profit = r - i;
    const roi = (profit / i) * 100;
    return { profit, roi };
  }, [investment, returnValue, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/roi-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.investment}</span><input value={investment} onChange={(e) => setInvestment(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.returnValue}</span><input value={returnValue} onChange={(e) => setReturnValue(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">Profit</div><div className="mt-1 font-mono text-sm">{result.profit.toFixed(2)}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">ROI</div><div className="mt-1 font-mono text-sm">{result.roi.toFixed(2)}%</div></div>
        </div>
      )}
    </section>
  );
}
