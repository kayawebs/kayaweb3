"use client";

import { useMemo, useState } from "react";

import { sha256 } from "ethers";
import { base58, bech32, bech32m } from "@scure/base";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "base58check / bech32",
    input: "Bitcoin address",
    status: "Validation result",
    format: "Detected format",
    network: "Detected network",
    invalid: "This is not a valid Bitcoin address.",
    example: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080",
  },
  zh: {
    command: "base58check / bech32",
    input: "Bitcoin 地址",
    status: "校验结果",
    format: "识别格式",
    network: "识别网络",
    invalid: "这不是一个有效的 Bitcoin 地址。",
    example: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080",
  },
} as const;

function hexToBytes(hex: string) {
  const normalized = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(normalized.length / 2);
  for (let index = 0; index < normalized.length; index += 2) {
    bytes[index / 2] = Number.parseInt(normalized.slice(index, index + 2), 16);
  }
  return bytes;
}

function isValidBase58Check(address: string) {
  const decoded = base58.decode(address);
  if (decoded.length < 5) throw new Error("invalid");
  const payload = decoded.slice(0, -4);
  const checksum = decoded.slice(-4);
  const first = hexToBytes(sha256(payload));
  const second = hexToBytes(sha256(first));
  const expected = second.slice(0, 4);
  if (!checksum.every((byte, index) => byte === expected[index])) {
    throw new Error("invalid");
  }

  const prefix = payload[0];
  if (prefix === 0x00 || prefix === 0x05) return { format: "base58", network: "mainnet" };
  if (prefix === 0x6f || prefix === 0xc4) return { format: "base58", network: "testnet" };
  return { format: "base58", network: "unknown" };
}

function decodeSegwit(address: string) {
  try {
    const decoded = bech32.decode(address);
    return { ...decoded, encoding: "bech32" as const };
  } catch {
    const decoded = bech32m.decode(address);
    return { ...decoded, encoding: "bech32m" as const };
  }
}

function validateBtcAddress(address: string) {
  const normalized = address.trim();
  if (!normalized) throw new Error("invalid");

  if (/^(bc1|tb1|bcrt1)/i.test(normalized)) {
    const decoded = decodeSegwit(normalized.toLowerCase());
    const [version] = decoded.words;
    if (version === undefined) throw new Error("invalid");
    const expectedEncoding = version === 0 ? "bech32" : "bech32m";
    if (decoded.encoding !== expectedEncoding) throw new Error("invalid");
    const network = decoded.prefix === "bc" ? "mainnet" : decoded.prefix === "tb" ? "testnet" : "regtest";
    return { format: decoded.encoding, network };
  }

  return isValidBase58Check(normalized);
}

export default function BtcAddressValidatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);

  const result = useMemo(() => {
    try {
      return validateBtcAddress(input);
    } catch {
      return { error: text.invalid };
    }
  }, [input, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/btc-address-validator</span>
        <span>{text.command}</span>
      </div>
      <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <label htmlFor="btc-address-validator-input" className="block text-sm font-medium">{text.input}</label>
        <input id="btc-address-validator-input" type="text" value={input} onChange={(event) => setInput(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.status}</div>
          {"error" in result ? (
            <p className="rounded border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{result.error}</p>
          ) : (
            <p className="rounded border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">Valid Bitcoin address.</p>
          )}
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.format}</div>
          <textarea readOnly value={"format" in result ? result.format : ""} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.network}</div>
          <textarea readOnly value={"network" in result ? result.network : ""} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
        </div>
      </div>
    </section>
  );
}
