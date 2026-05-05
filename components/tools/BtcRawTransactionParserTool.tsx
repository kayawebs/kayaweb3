"use client";

import { useMemo, useState } from "react";

import { address as btcAddress, networks, script as btcScript, Transaction } from "bitcoinjs-lib";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "parse raw tx",
    input: "Raw BTC transaction",
    output: "Parsed transaction detail",
    invalid: "Enter a valid raw Bitcoin transaction hex string.",
    example:
      "02000000000101f5d8ee39f85f3c4ddaf0e7f7f4dba39f768bc40b8b6e4f3f4d7d2f62ec4f7a090100000000fdffffff02a086010000000000160014751e76e8199196d454941c45d1b3a323f1433bd660ea000000000000160014bc3b654dca7e56b04dca18f2566cdaf02e8d9ada0247304402205f0a876d5d816721c08ef0d2ceac8c84d2cb67f8bbd76e8f43f4e8b51f7a2f1f022065ecbcb8a7b743a7e0c41e1d86fbc6a0df6b58b8f5931f8aa58f6714bb7a57e3012103b0bd634234abbb1ba1e986e884185c8b4c154f0d7c9c8d2d7a25a10b1d5e511700000000",
  },
  zh: {
    command: "parse raw tx",
    input: "原始 BTC 交易",
    output: "交易明细解析结果",
    invalid: "请输入一个合法的 Bitcoin 原始交易 hex 字符串。",
    example:
      "02000000000101f5d8ee39f85f3c4ddaf0e7f7f4dba39f768bc40b8b6e4f3f4d7d2f62ec4f7a090100000000fdffffff02a086010000000000160014751e76e8199196d454941c45d1b3a323f1433bd660ea000000000000160014bc3b654dca7e56b04dca18f2566cdaf02e8d9ada0247304402205f0a876d5d816721c08ef0d2ceac8c84d2cb67f8bbd76e8f43f4e8b51f7a2f1f022065ecbcb8a7b743a7e0c41e1d86fbc6a0df6b58b8f5931f8aa58f6714bb7a57e3012103b0bd634234abbb1ba1e986e884185c8b4c154f0d7c9c8d2d7a25a10b1d5e511700000000",
  },
} as const;

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function reverseHex(bytes: Uint8Array) {
  return Array.from(bytes).reverse().map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function detectAddress(script: Uint8Array) {
  try {
    return btcAddress.fromOutputScript(script, networks.bitcoin);
  } catch {
    try {
      return btcAddress.fromOutputScript(script, networks.testnet);
    } catch {
      return null;
    }
  }
}

function safeSerialize(value: unknown) {
  return JSON.stringify(
    value,
    (_, current) => (typeof current === "bigint" ? current.toString() : current),
    2,
  );
}

export default function BtcRawTransactionParserTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);

  const result = useMemo(() => {
    try {
      const tx = Transaction.fromHex(input.trim());
      return {
        output: safeSerialize({
          txid: tx.getId(),
          version: tx.version,
          locktime: tx.locktime,
          inputs: tx.ins.map((item, index) => ({
            index,
            prevTxid: reverseHex(item.hash),
            vout: item.index,
            scriptSigHex: toHex(item.script),
            scriptSigAsm: btcScript.toASM(item.script),
            sequence: item.sequence,
            witness: item.witness.map((part) => toHex(part)),
          })),
          outputs: tx.outs.map((item, index) => ({
            index,
            valueSats: item.value.toString(),
            scriptPubKeyHex: toHex(item.script),
            scriptPubKeyAsm: btcScript.toASM(item.script),
            address: detectAddress(item.script),
          })),
        }),
      };
    } catch {
      return { error: text.invalid };
    }
  }, [input, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/btc-raw-transaction-parser</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="btc-raw-transaction-parser-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="btc-raw-transaction-parser-input" value={input} onChange={(event) => setInput(event.target.value)} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.output}</div>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <textarea readOnly value={result.output} rows={16} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
