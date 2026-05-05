"use client";

import { useMemo, useState } from "react";

import { address as btcAddress, networks, Psbt } from "bitcoinjs-lib";

import type { ToolLocale } from "@/lib/tool-i18n";

type NetworkKey = "bitcoin" | "testnet";

const TEXT = {
  en: {
    command: "build psbt",
    network: "Network",
    inputTxid: "Input txid",
    inputVout: "Input vout",
    inputValue: "Input value (sats)",
    inputAddress: "Input address",
    outputAddress: "Recipient address",
    outputValue: "Recipient value (sats)",
    changeAddress: "Change address (optional)",
    changeValue: "Change value (sats, optional)",
    base64: "PSBT base64",
    hex: "PSBT hex",
    summary: "Builder summary",
    invalid: "Enter valid txid, vout, satoshi amounts, and Bitcoin addresses for the selected network.",
    bitcoin: "Bitcoin Mainnet",
    testnet: "Bitcoin Testnet",
  },
  zh: {
    command: "build psbt",
    network: "网络",
    inputTxid: "输入 txid",
    inputVout: "输入 vout",
    inputValue: "输入金额（sats）",
    inputAddress: "输入地址",
    outputAddress: "收款地址",
    outputValue: "收款金额（sats）",
    changeAddress: "找零地址（可选）",
    changeValue: "找零金额（sats，可选）",
    base64: "PSBT base64",
    hex: "PSBT hex",
    summary: "构建摘要",
    invalid: "请输入合法的 txid、vout、satoshi 金额，以及与所选网络匹配的 Bitcoin 地址。",
    bitcoin: "Bitcoin 主网",
    testnet: "Bitcoin 测试网",
  },
} as const;

function safeSerialize(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function isTxid(value: string) {
  return /^[0-9a-fA-F]{64}$/.test(value);
}

export default function PsbtBuilderTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [networkKey, setNetworkKey] = useState<NetworkKey>("bitcoin");
  const [inputTxid, setInputTxid] = useState<string>("");
  const [inputVout, setInputVout] = useState<string>("0");
  const [inputValue, setInputValue] = useState<string>("100000");
  const [inputAddress, setInputAddress] = useState<string>("");
  const [outputAddress, setOutputAddress] = useState<string>("");
  const [outputValue, setOutputValue] = useState<string>("90000");
  const [changeAddress, setChangeAddress] = useState<string>("");
  const [changeValue, setChangeValue] = useState<string>("9000");

  const result = useMemo(() => {
    if (!isTxid(inputTxid.trim()) || !/^\d+$/.test(inputVout) || !/^\d+$/.test(inputValue) || !/^\d+$/.test(outputValue)) {
      return { error: text.invalid };
    }

    const changeValueTrimmed = changeValue.trim();
    if (changeValueTrimmed && !/^\d+$/.test(changeValueTrimmed)) {
      return { error: text.invalid };
    }

    try {
      const network = networkKey === "bitcoin" ? networks.bitcoin : networks.testnet;
      const inputScript = btcAddress.toOutputScript(inputAddress.trim(), network);
      btcAddress.toOutputScript(outputAddress.trim(), network);

      const psbt = new Psbt({ network });
      psbt.addInput({
        hash: inputTxid.trim(),
        index: Number.parseInt(inputVout, 10),
        witnessUtxo: {
          script: inputScript,
          value: BigInt(inputValue),
        },
      });
      psbt.addOutput({
        address: outputAddress.trim(),
        value: BigInt(outputValue),
      });

      if (changeAddress.trim() && changeValueTrimmed) {
        btcAddress.toOutputScript(changeAddress.trim(), network);
        psbt.addOutput({
          address: changeAddress.trim(),
          value: BigInt(changeValueTrimmed),
        });
      }

      const inputSats = Number.parseInt(inputValue, 10);
      const outputSats = Number.parseInt(outputValue, 10);
      const changeSats = changeValueTrimmed ? Number.parseInt(changeValueTrimmed, 10) : 0;

      return {
        base64: psbt.toBase64(),
        hex: psbt.toHex(),
        summary: safeSerialize({
          network: networkKey,
          inputs: 1,
          outputs: changeAddress.trim() && changeValueTrimmed ? 2 : 1,
          totalInputSats: inputSats,
          totalOutputSats: outputSats + changeSats,
          impliedFeeSats: inputSats - outputSats - changeSats,
        }),
      };
    } catch {
      return { error: text.invalid };
    }
  }, [
    changeAddress,
    changeValue,
    inputAddress,
    inputTxid,
    inputValue,
    inputVout,
    networkKey,
    outputAddress,
    outputValue,
    text.invalid,
  ]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/psbt-builder</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
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
          {([
            [text.inputTxid, inputTxid, setInputTxid],
            [text.inputVout, inputVout, setInputVout],
            [text.inputValue, inputValue, setInputValue],
            [text.inputAddress, inputAddress, setInputAddress],
            [text.outputAddress, outputAddress, setOutputAddress],
            [text.outputValue, outputValue, setOutputValue],
            [text.changeAddress, changeAddress, setChangeAddress],
            [text.changeValue, changeValue, setChangeValue],
          ] as const).map(([label, value, setter]) => (
            <label key={label} className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
              <span className="block text-sm font-medium">{label}</span>
              <input
                type="text"
                value={value}
                onChange={(event) => setter(event.target.value)}
                className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
              />
            </label>
          ))}
        </div>
        <div className="space-y-4">
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <>
              <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
                <div className="text-sm font-medium">{text.base64}</div>
                <textarea readOnly value={result.base64} rows={8} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
              </div>
              <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
                <div className="text-sm font-medium">{text.hex}</div>
                <textarea readOnly value={result.hex} rows={8} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
              </div>
              <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
                <div className="text-sm font-medium">{text.summary}</div>
                <textarea readOnly value={result.summary} rows={8} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
