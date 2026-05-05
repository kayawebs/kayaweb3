"use client";

import { useMemo, useState } from "react";

import { Wallet, getBytes } from "ethers";
import { payments, networks } from "bitcoinjs-lib";

import type { ToolLocale } from "@/lib/tool-i18n";

type NetworkKey = "bitcoin" | "testnet";

const TEXT = {
  en: {
    command: "generate btc address",
    network: "Network",
    publicKey: "Compressed public key",
    privateKey: "Private key (hex)",
    legacy: "Legacy P2PKH",
    segwit: "Native SegWit P2WPKH",
    wrapped: "Wrapped SegWit P2SH-P2WPKH",
    refresh: "Generate new",
    bitcoin: "Bitcoin Mainnet",
    testnet: "Bitcoin Testnet",
  },
  zh: {
    command: "generate btc address",
    network: "网络",
    publicKey: "压缩公钥",
    privateKey: "私钥（hex）",
    legacy: "Legacy P2PKH",
    segwit: "原生 SegWit P2WPKH",
    wrapped: "封装 SegWit P2SH-P2WPKH",
    refresh: "重新生成",
    bitcoin: "Bitcoin 主网",
    testnet: "Bitcoin 测试网",
  },
} as const;

function buildRecord(networkKey: NetworkKey) {
  const wallet = Wallet.createRandom();
  const publicKeyBytes = getBytes(wallet.signingKey.compressedPublicKey);
  const network = networkKey === "bitcoin" ? networks.bitcoin : networks.testnet;

  const p2pkh = payments.p2pkh({ pubkey: Buffer.from(publicKeyBytes), network }).address ?? "";
  const p2wpkh = payments.p2wpkh({ pubkey: Buffer.from(publicKeyBytes), network }).address ?? "";
  const redeem = payments.p2wpkh({ pubkey: Buffer.from(publicKeyBytes), network });
  const p2sh = payments.p2sh({ redeem, network }).address ?? "";

  return {
    privateKey: wallet.privateKey,
    publicKey: wallet.signingKey.compressedPublicKey,
    p2pkh,
    p2wpkh,
    p2sh,
  };
}

export default function BtcAddressGeneratorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [networkKey, setNetworkKey] = useState<NetworkKey>("bitcoin");
  const [seed, setSeed] = useState<number>(0);

  const record = useMemo(() => {
    void seed;
    return buildRecord(networkKey);
  }, [networkKey, seed]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/btc-address-generator</span>
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
          <button
            type="button"
            onClick={() => setSeed((current) => current + 1)}
            className="w-full rounded border border-[var(--terminal-accent)] px-3 py-2 text-sm font-medium text-[var(--terminal-accent)] transition hover:bg-[var(--terminal-accent)]/10"
          >
            {text.refresh}
          </button>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {([
            [text.publicKey, record.publicKey],
            [text.privateKey, record.privateKey],
            [text.legacy, record.p2pkh],
            [text.segwit, record.p2wpkh],
            [text.wrapped, record.p2sh],
          ] as const).map(([label, value]) => (
            <div key={label} className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
              <div className="text-sm font-medium">{label}</div>
              <textarea readOnly value={value} rows={4} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
