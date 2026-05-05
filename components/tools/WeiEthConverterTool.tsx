"use client";

import { useMemo, useState } from "react";

import { formatUnits, parseUnits } from "ethers";

import type { ToolLocale } from "@/lib/tool-i18n";

type UnitKey = "wei" | "gwei" | "eth";

const UNIT_DECIMALS: Record<UnitKey, number> = {
  wei: 0,
  gwei: 9,
  eth: 18,
};

const TEXT = {
  en: {
    command: "cast to-unit",
    amount: "Amount",
    unit: "Input unit",
    example: "1000000000000000000",
    invalid: "Enter a valid decimal number for the selected unit.",
    wei: "Wei",
    gwei: "Gwei",
    eth: "ETH",
  },
  zh: {
    command: "cast to-unit",
    amount: "金额",
    unit: "输入单位",
    example: "1000000000000000000",
    invalid: "请输入与所选单位匹配的有效十进制数字。",
    wei: "Wei",
    gwei: "Gwei",
    eth: "ETH",
  },
} as const;

export default function WeiEthConverterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [amount, setAmount] = useState<string>(text.example);
  const [unit, setUnit] = useState<UnitKey>("wei");

  const result = useMemo(() => {
    const trimmed = amount.trim();
    if (!trimmed) {
      return {
        wei: "",
        gwei: "",
        eth: "",
      };
    }

    try {
      const wei = parseUnits(trimmed, UNIT_DECIMALS[unit]);
      return {
        wei: formatUnits(wei, 0),
        gwei: formatUnits(wei, 9),
        eth: formatUnits(wei, 18),
      };
    } catch {
      return { error: text.invalid };
    }
  }, [amount, text.invalid, unit]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/wei-eth-converter</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="wei-eth-converter-amount" className="block text-sm font-medium">{text.amount}</label>
          <input
            id="wei-eth-converter-amount"
            type="text"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
          {"error" in result && (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          )}
        </div>

        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="wei-eth-converter-unit" className="block text-sm font-medium">{text.unit}</label>
          <select
            id="wei-eth-converter-unit"
            value={unit}
            onChange={(event) => setUnit(event.target.value as UnitKey)}
            className="w-full rounded border border-[var(--terminal-border)] bg-[var(--background)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
          >
            <option value="wei">{text.wei}</option>
            <option value="gwei">{text.gwei}</option>
            <option value="eth">{text.eth}</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {(["wei", "gwei", "eth"] as const).map((item) => (
          <div key={item} className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text[item]}</div>
            <textarea
              readOnly
              value={item in result ? result[item] : ""}
              rows={4}
              className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
