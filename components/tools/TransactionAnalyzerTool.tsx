"use client";

import { useMemo, useState } from "react";

import { Transaction, getBytes, isHexString } from "ethers";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "analyze evm tx",
    input: "Raw signed transaction",
    output: "Transaction analysis",
    invalid: "Enter a valid raw signed EVM transaction hex string.",
  },
  zh: {
    command: "analyze evm tx",
    input: "原始签名交易",
    output: "交易分析结果",
    invalid: "请输入合法的原始签名 EVM 交易 hex 字符串。",
  },
} as const;

function safeSerialize(value: unknown) {
  return JSON.stringify(value, (_, current) => (typeof current === "bigint" ? current.toString() : current), 2);
}

export default function TransactionAnalyzerTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>("");

  const result = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return null;
    if (!isHexString(trimmed)) return { error: text.invalid };

    try {
      const tx = Transaction.from(trimmed);
      const dataBytes = tx.data ? getBytes(tx.data) : new Uint8Array();
      const zeroBytes = Array.from(dataBytes).filter((byte) => byte === 0).length;
      const nonZeroBytes = dataBytes.length - zeroBytes;
      const intrinsicGas = 21000 + zeroBytes * 4 + nonZeroBytes * 16;

      return {
        output: safeSerialize({
          hash: tx.hash,
          type: tx.type,
          chainId: tx.chainId?.toString() ?? null,
          from: tx.from,
          to: tx.to,
          nonce: tx.nonce,
          valueWei: tx.value.toString(),
          gasLimit: tx.gasLimit.toString(),
          gasPriceWei: tx.gasPrice?.toString() ?? null,
          maxFeePerGasWei: tx.maxFeePerGas?.toString() ?? null,
          maxPriorityFeePerGasWei: tx.maxPriorityFeePerGas?.toString() ?? null,
          dataBytes: dataBytes.length,
          zeroBytes,
          nonZeroBytes,
          intrinsicGasEstimate: intrinsicGas,
          accessListEntries: tx.accessList?.length ?? 0,
          signature: {
            v: tx.signature?.v ?? null,
            r: tx.signature?.r ?? null,
            s: tx.signature?.s ?? null,
          },
        }),
      };
    } catch {
      return { error: text.invalid };
    }
  }, [input, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/transaction-analyzer</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label className="block text-sm font-medium">{text.input}</label>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.output}</div>
          {result === null ? null : "error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <textarea readOnly value={result.output} rows={18} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
