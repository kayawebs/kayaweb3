"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "fee = input - output",
    inputTotal: "Total input value (sats)",
    outputTotal: "Total output value (sats)",
    vsize: "Virtual size (vbytes, optional)",
    feeSats: "Fee (sats)",
    feeBtc: "Fee (BTC)",
    feeRate: "Fee rate (sat/vB)",
    invalidValues: "Input and output totals must be valid non-negative integers.",
    invalidFee: "Total output value cannot exceed total input value.",
    invalidSize: "Virtual size must be a positive number if provided.",
  },
  zh: {
    command: "fee = input - output",
    inputTotal: "输入总额（sats）",
    outputTotal: "输出总额（sats）",
    vsize: "虚拟大小（vbytes，可选）",
    feeSats: "手续费（sats）",
    feeBtc: "手续费（BTC）",
    feeRate: "费率（sat/vB）",
    invalidValues: "输入总额和输出总额必须是合法的非负整数。",
    invalidFee: "输出总额不能大于输入总额。",
    invalidSize: "如果填写虚拟大小，必须是正数。",
  },
} as const;

const SATS_PER_BTC = BigInt("100000000");

function formatBtc(sats: bigint) {
  const whole = sats / SATS_PER_BTC;
  const fraction = (sats % SATS_PER_BTC).toString().padStart(8, "0").replace(/0+$/, "");
  return `${whole.toString()}${fraction ? `.${fraction}` : ""}`;
}

export default function BtcFeeCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [inputTotal, setInputTotal] = useState<string>("150000");
  const [outputTotal, setOutputTotal] = useState<string>("149000");
  const [vsize, setVsize] = useState<string>("141");

  const result = useMemo(() => {
    if (!/^\d+$/.test(inputTotal) || !/^\d+$/.test(outputTotal)) {
      return { error: text.invalidValues };
    }

    const inputValue = BigInt(inputTotal);
    const outputValue = BigInt(outputTotal);
    if (outputValue > inputValue) {
      return { error: text.invalidFee };
    }

    const fee = inputValue - outputValue;
    let feeRate = "";

    if (vsize.trim()) {
      const parsedSize = Number.parseFloat(vsize);
      if (!Number.isFinite(parsedSize) || parsedSize <= 0) {
        return { error: text.invalidSize };
      }
      feeRate = (Number(fee.toString()) / parsedSize).toFixed(2);
    }

    return {
      feeSats: fee.toString(),
      feeBtc: formatBtc(fee),
      feeRate,
    };
  }, [inputTotal, outputTotal, text.invalidFee, text.invalidSize, text.invalidValues, vsize]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/btc-fee-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="btc-fee-input" className="block text-sm font-medium">{text.inputTotal}</label>
          <input id="btc-fee-input" type="text" value={inputTotal} onChange={(event) => setInputTotal(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="btc-fee-output" className="block text-sm font-medium">{text.outputTotal}</label>
          <input id="btc-fee-output" type="text" value={outputTotal} onChange={(event) => setOutputTotal(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="btc-fee-vsize" className="block text-sm font-medium">{text.vsize}</label>
          <input id="btc-fee-vsize" type="text" value={vsize} onChange={(event) => setVsize(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.feeSats}</div>
            <textarea readOnly value={result.feeSats} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.feeBtc}</div>
            <textarea readOnly value={result.feeBtc} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.feeRate}</div>
            <textarea readOnly value={result.feeRate} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          </div>
        </div>
      )}
    </section>
  );
}
