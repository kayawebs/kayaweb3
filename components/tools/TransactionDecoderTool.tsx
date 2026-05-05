"use client";

import { useMemo, useState } from "react";

import { Transaction, formatEther } from "ethers";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "Transaction.from(rawTx)",
    input: "Raw signed transaction",
    output: "Decoded transaction",
    invalid: "Enter a valid raw EVM transaction hex string.",
    example:
      "0x02f8720180843b9aca00847735940082520894d8da6bf26964af9d7eed9e03e53415d37aa96045880de0b6b3a764000080c001a0815fb493f84bb5d8f8f445fb2de4cfe6682d94f871a865d1f0cc0633d7c0e547a0288d9814f2f6dd1b8e537f1d773e5ee30f7d95cf89f252be9e3f5d4642a0966a",
  },
  zh: {
    command: "Transaction.from(rawTx)",
    input: "原始签名交易",
    output: "交易解码结果",
    invalid: "请输入一个合法的 EVM 原始交易 hex 字符串。",
    example:
      "0x02f8720180843b9aca00847735940082520894d8da6bf26964af9d7eed9e03e53415d37aa96045880de0b6b3a764000080c001a0815fb493f84bb5d8f8f445fb2de4cfe6682d94f871a865d1f0cc0633d7c0e547a0288d9814f2f6dd1b8e537f1d773e5ee30f7d95cf89f252be9e3f5d4642a0966a",
  },
} as const;

function stringifyTransaction(tx: Transaction) {
  return JSON.stringify(
    {
      type: tx.type,
      chainId: tx.chainId?.toString() ?? null,
      nonce: tx.nonce,
      to: tx.to,
      from: tx.from,
      valueWei: tx.value.toString(),
      valueEth: formatEther(tx.value),
      gasLimit: tx.gasLimit.toString(),
      gasPrice: tx.gasPrice?.toString() ?? null,
      maxFeePerGas: tx.maxFeePerGas?.toString() ?? null,
      maxPriorityFeePerGas: tx.maxPriorityFeePerGas?.toString() ?? null,
      data: tx.data,
      accessList: tx.accessList ?? null,
      hash: tx.hash ?? null,
      unsignedHash: tx.unsignedHash,
      signature: tx.signature
        ? {
            r: tx.signature.r,
            s: tx.signature.s,
            v: tx.signature.v,
            yParity: tx.signature.yParity,
          }
        : null,
    },
    null,
    2,
  );
}

export default function TransactionDecoderTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);

  const result = useMemo(() => {
    try {
      const tx = Transaction.from(input.trim());
      return { output: stringifyTransaction(tx) };
    } catch {
      return { error: text.invalid };
    }
  }, [input, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/transaction-decoder</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="transaction-decoder-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="transaction-decoder-input" value={input} onChange={(event) => setInput(event.target.value)} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.output}</div>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <textarea readOnly value={result.output} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
