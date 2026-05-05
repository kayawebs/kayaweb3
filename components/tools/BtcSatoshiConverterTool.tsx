"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const SATS_PER_BTC = BigInt("100000000");

const TEXT = {
  en: {
    command: "btc <-> sats",
    amount: "Amount",
    unit: "Input unit",
    btc: "BTC",
    sats: "Satoshis",
    invalid: "Enter a valid BTC or satoshi amount.",
  },
  zh: {
    command: "btc <-> sats",
    amount: "金额",
    unit: "输入单位",
    btc: "BTC",
    sats: "聪",
    invalid: "请输入有效的 BTC 或 satoshi 数值。",
  },
} as const;

function formatSatsToBtc(sats: bigint) {
  const negative = sats < BigInt("0");
  const absolute = negative ? -sats : sats;
  const whole = absolute / SATS_PER_BTC;
  const fraction = (absolute % SATS_PER_BTC).toString().padStart(8, "0").replace(/0+$/, "");
  return `${negative ? "-" : ""}${whole.toString()}${fraction ? `.${fraction}` : ""}`;
}

function parseBtcToSats(value: string) {
  const trimmed = value.trim();
  if (!/^-?\d*(\.\d*)?$/.test(trimmed)) throw new Error("invalid");
  const negative = trimmed.startsWith("-");
  const normalized = negative ? trimmed.slice(1) : trimmed;
  const [whole = "0", fraction = ""] = normalized.split(".");
  if (fraction.length > 8) throw new Error("invalid");
  const paddedFraction = fraction.padEnd(8, "0");
  const combined = `${whole || "0"}${paddedFraction}`.replace(/^0+(?=\d)/, "") || "0";
  const sats = BigInt(combined);
  return negative ? -sats : sats;
}

export default function BtcSatoshiConverterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [amount, setAmount] = useState<string>("1");
  const [unit, setUnit] = useState<"btc" | "sats">("btc");

  const result = useMemo(() => {
    try {
      if (unit === "btc") {
        const sats = parseBtcToSats(amount);
        return {
          btc: formatSatsToBtc(sats),
          sats: sats.toString(),
        };
      }

      if (!/^-?\d+$/.test(amount.trim())) {
        throw new Error("invalid");
      }

      const sats = BigInt(amount.trim());
      return {
        btc: formatSatsToBtc(sats),
        sats: sats.toString(),
      };
    } catch {
      return { error: text.invalid };
    }
  }, [amount, text.invalid, unit]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/btc-satoshi-converter</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="btc-sats-amount" className="block text-sm font-medium">{text.amount}</label>
          <input id="btc-sats-amount" type="text" value={amount} onChange={(event) => setAmount(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="btc-sats-unit" className="block text-sm font-medium">{text.unit}</label>
          <select id="btc-sats-unit" value={unit} onChange={(event) => setUnit(event.target.value as "btc" | "sats")} className="w-full rounded border border-[var(--terminal-border)] bg-[var(--background)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]">
            <option value="btc">{text.btc}</option>
            <option value="sats">{text.sats}</option>
          </select>
        </div>
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.btc}</div>
            <textarea readOnly value={result.btc} rows={4} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.sats}</div>
            <textarea readOnly value={result.sats} rows={4} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          </div>
        </div>
      )}
    </section>
  );
}
