"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const SATS_PER_BTC = BigInt("100000000");

const TEXT = {
  en: {
    command: "change = input - send - fee",
    inputTotal: "Total input value (sats)",
    sendAmount: "Recipient amount (sats)",
    fee: "Fee (sats)",
    changeSats: "Change output (sats)",
    changeBtc: "Change output (BTC)",
    invalid: "All values must be valid non-negative integers.",
    insufficient: "Inputs do not cover the send amount plus fee.",
  },
  zh: {
    command: "change = input - send - fee",
    inputTotal: "输入总额（sats）",
    sendAmount: "收款金额（sats）",
    fee: "手续费（sats）",
    changeSats: "找零输出（sats）",
    changeBtc: "找零输出（BTC）",
    invalid: "所有数值都必须是合法的非负整数。",
    insufficient: "输入总额不足以覆盖收款金额和手续费。",
  },
} as const;

function formatBtcFromSats(sats: bigint) {
  const whole = sats / SATS_PER_BTC;
  const fraction = (sats % SATS_PER_BTC).toString().padStart(8, "0").replace(/0+$/, "");
  return `${whole.toString()}${fraction ? `.${fraction}` : ""}`;
}

export default function BtcChangeOutputCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [inputTotal, setInputTotal] = useState<string>("150000");
  const [sendAmount, setSendAmount] = useState<string>("90000");
  const [fee, setFee] = useState<string>("1200");

  const result = useMemo(() => {
    if (!/^\d+$/.test(inputTotal) || !/^\d+$/.test(sendAmount) || !/^\d+$/.test(fee)) {
      return { error: text.invalid };
    }

    const inputValue = BigInt(inputTotal);
    const sendValue = BigInt(sendAmount);
    const feeValue = BigInt(fee);
    const remaining = inputValue - sendValue - feeValue;
    if (remaining < BigInt("0")) {
      return { error: text.insufficient };
    }

    return {
      sats: remaining.toString(),
      btc: formatBtcFromSats(remaining),
    };
  }, [fee, inputTotal, sendAmount, text.insufficient, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/btc-change-output-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="btc-change-input" className="block text-sm font-medium">{text.inputTotal}</label>
          <input id="btc-change-input" type="text" value={inputTotal} onChange={(event) => setInputTotal(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="btc-change-send" className="block text-sm font-medium">{text.sendAmount}</label>
          <input id="btc-change-send" type="text" value={sendAmount} onChange={(event) => setSendAmount(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="btc-change-fee" className="block text-sm font-medium">{text.fee}</label>
          <input id="btc-change-fee" type="text" value={fee} onChange={(event) => setFee(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.changeSats}</div>
            <textarea readOnly value={result.sats} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.changeBtc}</div>
            <textarea readOnly value={result.btc} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          </div>
        </div>
      )}
    </section>
  );
}
