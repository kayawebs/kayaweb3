"use client";

import { useMemo, useState } from "react";

import { formatUnits, parseUnits } from "ethers";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "parseUnits / formatUnits",
    decimals: "Token decimals",
    tokenAmount: "Token amount",
    rawAmount: "Raw integer amount",
    exampleToken: "1.5",
    exampleRaw: "1500000",
    invalidDecimals: "Decimals must be an integer between 0 and 255.",
    invalidToken: "Enter a valid decimal token amount.",
    invalidRaw: "Enter a valid integer raw amount.",
  },
  zh: {
    command: "parseUnits / formatUnits",
    decimals: "Token decimals",
    tokenAmount: "代币显示金额",
    rawAmount: "链上原始整数值",
    exampleToken: "1.5",
    exampleRaw: "1500000",
    invalidDecimals: "Decimals 必须是 0 到 255 之间的整数。",
    invalidToken: "请输入有效的十进制代币金额。",
    invalidRaw: "请输入有效的整数原始值。",
  },
} as const;

export default function TokenDecimalsConverterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [decimalsInput, setDecimalsInput] = useState<string>("6");
  const [tokenAmount, setTokenAmount] = useState<string>(text.exampleToken);
  const [rawAmount, setRawAmount] = useState<string>(text.exampleRaw);
  const [lastEdited, setLastEdited] = useState<"token" | "raw">("token");

  const result = useMemo(() => {
    if (!/^\d+$/.test(decimalsInput)) {
      return { error: text.invalidDecimals };
    }

    const decimals = Number.parseInt(decimalsInput, 10);
    if (decimals < 0 || decimals > 255) {
      return { error: text.invalidDecimals };
    }

    if (lastEdited === "token") {
      try {
        return {
          decimals,
          tokenAmount,
          rawAmount: parseUnits(tokenAmount || "0", decimals).toString(),
        };
      } catch {
        return { error: text.invalidToken };
      }
    }

    if (!/^-?\d+$/.test(rawAmount.trim() || "0")) {
      return { error: text.invalidRaw };
    }

    try {
      return {
        decimals,
        tokenAmount: formatUnits(BigInt(rawAmount || "0"), decimals),
        rawAmount,
      };
    } catch {
      return { error: text.invalidRaw };
    }
  }, [decimalsInput, lastEdited, rawAmount, text.invalidDecimals, text.invalidRaw, text.invalidToken, tokenAmount]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/token-decimals-converter</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1fr_1fr]">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="token-decimals-input" className="block text-sm font-medium">{text.decimals}</label>
          <input
            id="token-decimals-input"
            type="text"
            inputMode="numeric"
            value={decimalsInput}
            onChange={(event) => setDecimalsInput(event.target.value)}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
        </div>

        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="token-amount-input" className="block text-sm font-medium">{text.tokenAmount}</label>
          <textarea
            id="token-amount-input"
            value={lastEdited === "raw" && "tokenAmount" in result ? result.tokenAmount : tokenAmount}
            onChange={(event) => {
              setLastEdited("token");
              setTokenAmount(event.target.value);
            }}
            rows={5}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
        </div>

        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="token-raw-input" className="block text-sm font-medium">{text.rawAmount}</label>
          <textarea
            id="token-raw-input"
            value={lastEdited === "token" && "rawAmount" in result ? result.rawAmount : rawAmount}
            onChange={(event) => {
              setLastEdited("raw");
              setRawAmount(event.target.value);
            }}
            rows={5}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
        </div>
      </div>

      {"error" in result && (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      )}
    </section>
  );
}
