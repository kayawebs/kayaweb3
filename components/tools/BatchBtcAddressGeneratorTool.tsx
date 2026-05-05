"use client";

import { useMemo, useState } from "react";

import { Wallet, getBytes } from "ethers";
import { payments, networks } from "bitcoinjs-lib";

import type { ToolLocale } from "@/lib/tool-i18n";

type NetworkKey = "bitcoin" | "testnet";

const TEXT = {
  en: {
    command: "generate batch addresses",
    network: "Network",
    count: "Address count",
    output: "Generated addresses",
    refresh: "Regenerate batch",
    invalid: "Enter a positive integer between 1 and 20.",
    bitcoin: "Bitcoin Mainnet",
    testnet: "Bitcoin Testnet",
  },
  zh: {
    command: "generate batch addresses",
    network: "网络",
    count: "地址数量",
    output: "批量生成结果",
    refresh: "重新生成一批",
    invalid: "请输入 1 到 20 之间的正整数。",
    bitcoin: "Bitcoin 主网",
    testnet: "Bitcoin 测试网",
  },
} as const;

function makeEntry(networkKey: NetworkKey, index: number) {
  const wallet = Wallet.createRandom();
  const pubkey = Buffer.from(getBytes(wallet.signingKey.compressedPublicKey));
  const network = networkKey === "bitcoin" ? networks.bitcoin : networks.testnet;

  return {
    index: index + 1,
    p2wpkh: payments.p2wpkh({ pubkey, network }).address ?? "",
    p2pkh: payments.p2pkh({ pubkey, network }).address ?? "",
    privateKey: wallet.privateKey,
  };
}

export default function BatchBtcAddressGeneratorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [networkKey, setNetworkKey] = useState<NetworkKey>("bitcoin");
  const [count, setCount] = useState<string>("5");
  const [seed, setSeed] = useState<number>(0);

  const result = useMemo(() => {
    void seed;
    if (!/^\d+$/.test(count)) {
      return { error: text.invalid };
    }
    const total = Number.parseInt(count, 10);
    if (total < 1 || total > 20) {
      return { error: text.invalid };
    }

    return {
      output: JSON.stringify(Array.from({ length: total }, (_, index) => makeEntry(networkKey, index)), null, 2),
    };
  }, [count, networkKey, seed, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/batch-btc-address-generator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-[220px,1fr]">
        <div className="space-y-4 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label className="space-y-2">
            <span className="block text-sm font-medium">{text.network}</span>
            <select
              value={networkKey}
              onChange={(event) => setNetworkKey(event.target.value as NetworkKey)}
              className="w-full rounded border border-[var(--terminal-border)] bg-[var(--background)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
            >
              <option value="bitcoin">{text.bitcoin}</option>
              <option value="testnet">{text.testnet}</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="block text-sm font-medium">{text.count}</span>
            <input
              type="text"
              value={count}
              onChange={(event) => setCount(event.target.value)}
              className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
            />
          </label>
          <button
            type="button"
            onClick={() => setSeed((current) => current + 1)}
            className="w-full rounded border border-[var(--terminal-accent)] px-3 py-2 text-sm font-medium text-[var(--terminal-accent)] transition hover:bg-[var(--terminal-accent)]/10"
          >
            {text.refresh}
          </button>
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.output}</div>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <textarea readOnly value={result.output} rows={22} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
