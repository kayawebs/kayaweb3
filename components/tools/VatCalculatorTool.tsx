"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "vat",
    net: "Net amount",
    rate: "VAT rate %",
    invalid: "Enter valid numbers. Net amount and VAT rate must not be negative.",
  },
  zh: {
    command: "vat",
    net: "净额",
    rate: "VAT 税率 %",
    invalid: "请输入合法数字。净额和 VAT 税率不能为负。",
  },
} as const;

export default function VatCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [net, setNet] = useState("100");
  const [rate, setRate] = useState("20");

  const result = useMemo(() => {
    const n = Number(net || 0);
    const r = Number(rate || 0);
    if (![n, r].every(Number.isFinite) || n < 0 || r < 0) return { error: text.invalid };
    const vat = n * (r / 100);
    return {
      vat,
      gross: n + vat,
    };
  }, [net, rate, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/vat-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.net}</span><input value={net} onChange={(e) => setNet(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.rate}</span><input value={rate} onChange={(e) => setRate(e.target.value)} inputMode="decimal" className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" /></label>
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">VAT amount</div><div className="mt-1 font-mono text-sm">{result.vat.toFixed(2)}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">Gross amount</div><div className="mt-1 font-mono text-sm">{result.gross.toFixed(2)}</div></div>
        </div>
      )}
    </section>
  );
}
