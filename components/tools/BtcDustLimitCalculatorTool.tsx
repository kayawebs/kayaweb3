"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

type OutputType = "p2pkh" | "p2wpkh" | "p2sh" | "p2tr";

const OUTPUT_SIZES: Record<OutputType, number> = {
  p2pkh: 34,
  p2wpkh: 31,
  p2sh: 32,
  p2tr: 43,
};

const SPEND_VBYTES: Record<OutputType, number> = {
  p2pkh: 148,
  p2wpkh: 68,
  p2sh: 91,
  p2tr: 58,
};

const TEXT = {
  en: {
    command: "estimate dust",
    outputType: "Output type",
    feeRate: "Relay fee rate (sat/vB)",
    dustSats: "Estimated dust limit (sats)",
    note: "Rule of thumb: 3 * (output bytes + spend vbytes) * fee rate",
    invalid: "Fee rate must be a valid positive number.",
    p2pkh: "P2PKH",
    p2wpkh: "P2WPKH",
    p2sh: "P2SH",
    p2tr: "P2TR",
  },
  zh: {
    command: "estimate dust",
    outputType: "输出类型",
    feeRate: "中继费率（sat/vB）",
    dustSats: "估算 dust 阈值（sats）",
    note: "经验公式：3 *（输出字节 + 花费该输出的 vbytes）* 费率",
    invalid: "费率必须是合法的正数。",
    p2pkh: "P2PKH",
    p2wpkh: "P2WPKH",
    p2sh: "P2SH",
    p2tr: "P2TR",
  },
} as const;

export default function BtcDustLimitCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [outputType, setOutputType] = useState<OutputType>("p2wpkh");
  const [feeRate, setFeeRate] = useState<string>("1");

  const result = useMemo(() => {
    const parsedFeeRate = Number.parseFloat(feeRate);
    if (!Number.isFinite(parsedFeeRate) || parsedFeeRate <= 0) {
      return { error: text.invalid };
    }
    const dust = Math.ceil(3 * (OUTPUT_SIZES[outputType] + SPEND_VBYTES[outputType]) * parsedFeeRate);
    return { dust: dust.toString() };
  }, [feeRate, outputType, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/btc-dust-limit-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="btc-dust-output-type" className="block text-sm font-medium">{text.outputType}</label>
          <select id="btc-dust-output-type" value={outputType} onChange={(event) => setOutputType(event.target.value as OutputType)} className="w-full rounded border border-[var(--terminal-border)] bg-[var(--background)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]">
            <option value="p2pkh">{text.p2pkh}</option>
            <option value="p2wpkh">{text.p2wpkh}</option>
            <option value="p2sh">{text.p2sh}</option>
            <option value="p2tr">{text.p2tr}</option>
          </select>
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="btc-dust-fee-rate" className="block text-sm font-medium">{text.feeRate}</label>
          <input id="btc-dust-fee-rate" type="text" value={feeRate} onChange={(event) => setFeeRate(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.dustSats}</div>
            <textarea readOnly value={result.dust} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          </div>
          <p className="text-sm text-[var(--foreground)]/75">{text.note}</p>
        </div>
      )}
    </section>
  );
}
