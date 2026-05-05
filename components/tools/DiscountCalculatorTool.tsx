"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "expr price '*' discount",
    original: "Original price",
    discount: "Discount %",
    invalid: "Enter valid numbers. Discount cannot be below 0%.",
  },
  zh: {
    command: "expr price '*' discount",
    original: "原价",
    discount: "折扣 %",
    invalid: "请输入合法数字，折扣不能小于 0%。",
  },
} as const;

export default function DiscountCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [original, setOriginal] = useState("199.99");
  const [discount, setDiscount] = useState("20");

  const result = useMemo(() => {
    const o = Number(original || 0);
    const d = Number(discount || 0);
    if (![o, d].every(Number.isFinite) || d < 0) return { error: text.invalid };
    const savings = o * (d / 100);
    const finalPrice = o - savings;
    return { savings, finalPrice };
  }, [discount, original, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/discount-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.original}</span><input value={original} onChange={(e) => setOriginal(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.discount}</span><input value={discount} onChange={(e) => setDiscount(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">Savings</div><div className="mt-1 font-mono text-sm">{result.savings.toFixed(2)}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">Final price</div><div className="mt-1 font-mono text-sm">{result.finalPrice.toFixed(2)}</div></div>
        </div>
      )}
    </section>
  );
}
