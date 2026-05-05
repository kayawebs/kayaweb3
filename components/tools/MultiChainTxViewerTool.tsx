"use client";

import { useEffect, useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

type ChainKey = "ethereum" | "base" | "arbitrum" | "optimism";

const RPCS: Record<ChainKey, string> = {
  ethereum: "https://cloudflare-eth.com",
  base: "https://mainnet.base.org",
  arbitrum: "https://arb1.arbitrum.io/rpc",
  optimism: "https://mainnet.optimism.io",
};

const TEXT = {
  en: {
    command: "query tx across chains",
    txHash: "Transaction hash",
    output: "Multi-chain result",
    invalid: "Enter a valid 0x-prefixed 32-byte transaction hash.",
    waiting: "Enter a transaction hash to query the preset EVM chains.",
    loading: "Querying Ethereum, Base, Arbitrum, and Optimism...",
  },
  zh: {
    command: "query tx across chains",
    txHash: "交易哈希",
    output: "多链查询结果",
    invalid: "请输入合法的 0x 前缀 32 字节交易哈希。",
    waiting: "输入交易哈希后即可查询预设 EVM 链。",
    loading: "正在查询 Ethereum、Base、Arbitrum 和 Optimism...",
  },
} as const;

type ViewResult =
  | { key: string; status: "error"; message: string }
  | { key: string; status: "ready"; output: string };

async function rpcCall(rpcUrl: string, method: string, params: unknown[]) {
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const payload = (await response.json()) as { result?: unknown; error?: { message?: string } };
  if (payload.error) {
    throw new Error(payload.error.message || "RPC error");
  }
  return payload.result;
}

function safeSerialize(value: unknown) {
  return JSON.stringify(value, (_, current) => (typeof current === "bigint" ? current.toString() : current), 2);
}

export default function MultiChainTxViewerTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [txHash, setTxHash] = useState<string>("");
  const [result, setResult] = useState<ViewResult | null>(null);

  const validation = useMemo(() => {
    const trimmed = txHash.trim();
    if (!trimmed) return { kind: "idle" } as const;
    if (!/^0x[0-9a-fA-F]{64}$/.test(trimmed)) return { kind: "invalid", message: text.invalid } as const;
    return { kind: "ready", key: trimmed.toLowerCase(), txHash: trimmed } as const;
  }, [text.invalid, txHash]);

  useEffect(() => {
    if (validation.kind !== "ready") return;
    let cancelled = false;

    const timeoutId = window.setTimeout(async () => {
      try {
        const entries = await Promise.all(
          (Object.entries(RPCS) as Array<[ChainKey, string]>).map(async ([chain, rpcUrl]) => {
            const [tx, receipt] = await Promise.all([
              rpcCall(rpcUrl, "eth_getTransactionByHash", [validation.txHash]),
              rpcCall(rpcUrl, "eth_getTransactionReceipt", [validation.txHash]),
            ]);
            return {
              chain,
              found: Boolean(tx),
              transaction: tx,
              receipt,
            };
          }),
        );

        if (!cancelled) {
          setResult({ key: validation.key, status: "ready", output: safeSerialize(entries) });
        }
      } catch (error) {
        if (!cancelled) {
          setResult({
            key: validation.key,
            status: "error",
            message: error instanceof Error ? error.message : text.invalid,
          });
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [text.invalid, validation]);

  const display =
    validation.kind === "idle"
      ? { status: "idle" as const }
      : validation.kind === "invalid"
        ? { status: "error" as const, message: validation.message }
        : result?.key !== validation.key
          ? { status: "loading" as const }
          : result;

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/multi-chain-tx-viewer</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label className="block text-sm font-medium">{text.txHash}</label>
          <input value={txHash} onChange={(event) => setTxHash(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.output}</div>
          {display.status === "idle" ? <p className="text-sm text-[var(--foreground)]/70">{text.waiting}</p> : null}
          {display.status === "loading" ? <p className="text-sm text-[var(--foreground)]/70">{text.loading}</p> : null}
          {display.status === "error" ? <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{display.message}</p> : null}
          {display.status === "ready" ? <textarea readOnly value={display.output} rows={18} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" /> : null}
        </div>
      </div>
    </section>
  );
}
