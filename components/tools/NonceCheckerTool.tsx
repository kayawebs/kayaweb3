"use client";

import { useEffect, useMemo, useState } from "react";

import { getAddress, isAddress } from "ethers";

import type { ToolLocale } from "@/lib/tool-i18n";

type ChainPreset = "ethereum" | "base" | "arbitrum" | "optimism" | "custom";

const PRESET_RPC_URLS: Record<Exclude<ChainPreset, "custom">, string> = {
  ethereum: "https://cloudflare-eth.com",
  base: "https://mainnet.base.org",
  arbitrum: "https://arb1.arbitrum.io/rpc",
  optimism: "https://mainnet.optimism.io",
};

const TEXT = {
  en: {
    command: "check nonce",
    chain: "Chain preset",
    rpcUrl: "RPC URL",
    address: "Wallet address",
    result: "Nonce result",
    loading: "Checking latest and pending nonce...",
    invalidAddress: "Enter a valid EVM address.",
    invalidRpc: "Enter a valid RPC URL.",
    networkError: "Unable to fetch nonce from this RPC endpoint.",
    placeholderAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    latest: "Latest mined nonce",
    pending: "Pending nonce",
    gap: "Pending gap",
    chainId: "Chain ID",
    note: "The pending gap shows how many queued nonces are ahead of the latest mined state.",
    ethereum: "Ethereum",
    base: "Base",
    arbitrum: "Arbitrum",
    optimism: "Optimism",
    custom: "Custom",
    waiting: "Enter an address to query live nonce values.",
  },
  zh: {
    command: "check nonce",
    chain: "链预设",
    rpcUrl: "RPC 地址",
    address: "钱包地址",
    result: "Nonce 查询结果",
    loading: "正在查询 latest 和 pending nonce...",
    invalidAddress: "请输入合法的 EVM 地址。",
    invalidRpc: "请输入合法的 RPC URL。",
    networkError: "无法从当前 RPC 节点获取 nonce。",
    placeholderAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    latest: "Latest 已确认 nonce",
    pending: "Pending 当前 nonce",
    gap: "Pending 差值",
    chainId: "链 ID",
    note: "Pending 差值表示在最新已确认状态之外，还有多少排队中的 nonce。",
    ethereum: "Ethereum",
    base: "Base",
    arbitrum: "Arbitrum",
    optimism: "Optimism",
    custom: "自定义",
    waiting: "输入地址后即可实时查询 nonce。",
  },
} as const;

type NonceResult =
  | { key: string; status: "error"; message: string }
  | {
      key: string;
      status: "ready";
      latest: number;
      pending: number;
      gap: number;
      chainId: string;
    };

async function rpcCall(rpcUrl: string, method: string, params: unknown[]) {
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const payload = (await response.json()) as { result?: string; error?: { message?: string } };
  if (payload.error || typeof payload.result !== "string") {
    throw new Error(payload.error?.message || "RPC error");
  }

  return payload.result;
}

export default function NonceCheckerTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [chain, setChain] = useState<ChainPreset>("base");
  const [customRpcUrl, setCustomRpcUrl] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [result, setResult] = useState<NonceResult | null>(null);

  const rpcUrl = chain === "custom" ? customRpcUrl : PRESET_RPC_URLS[chain];

  const normalizedAddress = useMemo(() => {
    const trimmed = address.trim();
    return isAddress(trimmed) ? getAddress(trimmed) : null;
  }, [address]);

  const validation = useMemo(() => {
    const trimmedRpcUrl = rpcUrl.trim();
    if (!address.trim()) return { kind: "idle" } as const;
    if (!normalizedAddress) return { kind: "invalid", message: text.invalidAddress } as const;
    if (!/^https?:\/\//.test(trimmedRpcUrl)) return { kind: "invalid", message: text.invalidRpc } as const;
    return {
      kind: "ready",
      rpcUrl: trimmedRpcUrl,
      address: normalizedAddress,
      key: `${trimmedRpcUrl}::${normalizedAddress}`,
    } as const;
  }, [address, normalizedAddress, rpcUrl, text.invalidAddress, text.invalidRpc]);

  useEffect(() => {
    if (validation.kind !== "ready") {
      return;
    }
    let cancelled = false;

    const timeoutId = window.setTimeout(async () => {
      try {
        const [latestHex, pendingHex, chainIdHex] = await Promise.all([
          rpcCall(validation.rpcUrl, "eth_getTransactionCount", [validation.address, "latest"]),
          rpcCall(validation.rpcUrl, "eth_getTransactionCount", [validation.address, "pending"]),
          rpcCall(validation.rpcUrl, "eth_chainId", []),
        ]);

        if (cancelled) return;

        const latest = Number.parseInt(latestHex, 16);
        const pending = Number.parseInt(pendingHex, 16);
        const chainId = Number.parseInt(chainIdHex, 16).toString();

        setResult({
          key: validation.key,
          status: "ready",
          latest,
          pending,
          gap: Math.max(pending - latest, 0),
          chainId,
        });
      } catch {
        if (!cancelled) {
          setResult({ key: validation.key, status: "error", message: text.networkError });
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [text.networkError, validation]);

  const displayResult:
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "ready"; latest: number; pending: number; gap: number; chainId: string } =
    validation.kind === "idle"
      ? { status: "idle" }
      : validation.kind === "invalid"
        ? { status: "error", message: validation.message }
        : result?.key !== validation.key
          ? { status: "loading" }
          : result.status === "error"
            ? { status: "error", message: result.message }
            : {
                status: "ready",
                latest: result.latest,
                pending: result.pending,
                gap: result.gap,
                chainId: result.chainId,
              };

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/nonce-checker</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="nonce-checker-chain" className="block text-sm font-medium">{text.chain}</label>
          <select
            id="nonce-checker-chain"
            value={chain}
            onChange={(event) => setChain(event.target.value as ChainPreset)}
            className="w-full rounded border border-[var(--terminal-border)] bg-[var(--background)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
          >
            <option value="ethereum">{text.ethereum}</option>
            <option value="base">{text.base}</option>
            <option value="arbitrum">{text.arbitrum}</option>
            <option value="optimism">{text.optimism}</option>
            <option value="custom">{text.custom}</option>
          </select>
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 lg:col-span-2">
          <label htmlFor="nonce-checker-rpc" className="block text-sm font-medium">{text.rpcUrl}</label>
          <input
            id="nonce-checker-rpc"
            type="text"
            value={rpcUrl}
            onChange={(event) => setCustomRpcUrl(event.target.value)}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
        </div>
      </div>
      <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <label htmlFor="nonce-checker-address" className="block text-sm font-medium">{text.address}</label>
        <input
          id="nonce-checker-address"
          type="text"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder={text.placeholderAddress}
          className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
        />
      </div>
      <div className="space-y-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <div className="text-sm font-medium">{text.result}</div>
        {displayResult.status === "idle" ? <p className="text-sm text-[var(--foreground)]/70">{text.waiting}</p> : null}
        {displayResult.status === "loading" ? <p className="text-sm text-[var(--foreground)]/70">{text.loading}</p> : null}
        {displayResult.status === "error" ? (
          <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{displayResult.message}</p>
        ) : null}
        {displayResult.status === "ready" ? (
          <div className="grid gap-4 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.latest}</div>
              <div className="rounded border border-[var(--terminal-border)] px-3 py-2 font-mono text-sm">{displayResult.latest}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.pending}</div>
              <div className="rounded border border-[var(--terminal-border)] px-3 py-2 font-mono text-sm">{displayResult.pending}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.gap}</div>
              <div className="rounded border border-[var(--terminal-border)] px-3 py-2 font-mono text-sm">{displayResult.gap}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.chainId}</div>
              <div className="rounded border border-[var(--terminal-border)] px-3 py-2 font-mono text-sm">{displayResult.chainId}</div>
            </div>
          </div>
        ) : null}
        {displayResult.status === "ready" ? <p className="text-xs text-[var(--foreground)]/65">{text.note}</p> : null}
      </div>
    </section>
  );
}
