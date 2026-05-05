"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const SATS_PER_BTC = BigInt("100000000");

const TEXT = {
  en: {
    command: "fee = vbytes * sat/vB",
    vbytes: "Transaction size (vbytes)",
    feeRate: "Target fee rate (sat/vB)",
    feeSats: "Estimated fee (sats)",
    feeBtc: "Estimated fee (BTC)",
    invalidVbytes: "Transaction size must be a positive number.",
    invalidFeeRate: "Fee rate must be a valid non-negative number.",
  },
  zh: {
    command: "fee = vbytes * sat/vB",
    vbytes: "交易大小（vbytes）",
    feeRate: "目标费率（sat/vB）",
    feeSats: "估算手续费（sats）",
    feeBtc: "估算手续费（BTC）",
    invalidVbytes: "交易大小必须是正数。",
    invalidFeeRate: "费率必须是合法的非负数。",
  },
} as const;

function formatBtcFromSats(sats: bigint) {
  const whole = sats / SATS_PER_BTC;
  const fraction = (sats % SATS_PER_BTC).toString().padStart(8, "0").replace(/0+$/, "");
  return `${whole.toString()}${fraction ? `.${fraction}` : ""}`;
}

export default function BtcFeeEstimatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [vbytes, setVbytes] = useState<string>("141");
  const [feeRate, setFeeRate] = useState<string>("12.5");

  const result = useMemo(() => {
    const parsedVbytes = Number.parseFloat(vbytes);
    const parsedFeeRate = Number.parseFloat(feeRate);
    if (!Number.isFinite(parsedVbytes) || parsedVbytes <= 0) {
      return { error: text.invalidVbytes };
    }
    if (!Number.isFinite(parsedFeeRate) || parsedFeeRate < 0) {
      return { error: text.invalidFeeRate };
    }

    const sats = BigInt(Math.ceil(parsedVbytes * parsedFeeRate));
    return {
      sats: sats.toString(),
      btc: formatBtcFromSats(sats),
    };
  }, [feeRate, text.invalidFeeRate, text.invalidVbytes, vbytes]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/btc-fee-estimator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="btc-fee-estimator-vbytes" className="block text-sm font-medium">{text.vbytes}</label>
          <input id="btc-fee-estimator-vbytes" type="text" value={vbytes} onChange={(event) => setVbytes(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="btc-fee-estimator-rate" className="block text-sm font-medium">{text.feeRate}</label>
          <input id="btc-fee-estimator-rate" type="text" value={feeRate} onChange={(event) => setFeeRate(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.feeSats}</div>
            <textarea readOnly value={result.sats} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.feeBtc}</div>
            <textarea readOnly value={result.btc} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          </div>
        </div>
      )}
    </section>
  );
}
