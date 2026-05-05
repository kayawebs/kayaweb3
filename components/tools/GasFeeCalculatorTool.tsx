"use client";

import { useMemo, useState } from "react";

import { formatEther, formatUnits, parseUnits } from "ethers";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "gas math",
    gasLimit: "Gas limit",
    gasPrice: "Gas price (gwei)",
    totalWei: "Total fee (wei)",
    totalGwei: "Total fee (gwei)",
    totalEth: "Total fee (ETH)",
    invalidLimit: "Gas limit must be a positive integer.",
    invalidPrice: "Gas price must be a valid decimal number.",
  },
  zh: {
    command: "gas math",
    gasLimit: "Gas limit",
    gasPrice: "Gas price（gwei）",
    totalWei: "总手续费（wei）",
    totalGwei: "总手续费（gwei）",
    totalEth: "总手续费（ETH）",
    invalidLimit: "Gas limit 必须是正整数。",
    invalidPrice: "Gas price 必须是有效的十进制数字。",
  },
} as const;

export default function GasFeeCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [gasLimit, setGasLimit] = useState<string>("21000");
  const [gasPrice, setGasPrice] = useState<string>("20");

  const result = useMemo(() => {
    if (!/^\d+$/.test(gasLimit) || BigInt(gasLimit || "0") <= BigInt("0")) {
      return { error: text.invalidLimit };
    }

    try {
      const gasPriceWei = parseUnits(gasPrice || "0", 9);
      const totalWei = BigInt(gasLimit) * gasPriceWei;

      return {
        wei: totalWei.toString(),
        gwei: formatUnits(totalWei, 9),
        eth: formatEther(totalWei),
      };
    } catch {
      return { error: text.invalidPrice };
    }
  }, [gasLimit, gasPrice, text.invalidLimit, text.invalidPrice]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/gas-fee-calculator</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="gas-fee-limit" className="block text-sm font-medium">{text.gasLimit}</label>
          <input
            id="gas-fee-limit"
            type="text"
            inputMode="numeric"
            value={gasLimit}
            onChange={(event) => setGasLimit(event.target.value)}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
        </div>

        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="gas-fee-price" className="block text-sm font-medium">{text.gasPrice}</label>
          <input
            id="gas-fee-price"
            type="text"
            value={gasPrice}
            onChange={(event) => setGasPrice(event.target.value)}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
        </div>
      </div>

      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.totalWei}</div>
            <textarea readOnly value={result.wei} rows={4} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.totalGwei}</div>
            <textarea readOnly value={result.gwei} rows={4} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.totalEth}</div>
            <textarea readOnly value={result.eth} rows={4} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          </div>
        </div>
      )}
    </section>
  );
}
