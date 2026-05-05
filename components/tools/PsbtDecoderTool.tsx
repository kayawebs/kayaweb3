"use client";

import { useMemo, useState } from "react";

import { address as btcAddress, networks, Psbt, script as btcScript } from "bitcoinjs-lib";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "decode psbt",
    input: "PSBT (base64 or hex)",
    output: "Decoded PSBT",
    empty: "Paste a PSBT in base64 or hex format.",
    invalid: "Enter a valid PSBT in base64 or hex format.",
  },
  zh: {
    command: "decode psbt",
    input: "PSBT（base64 或 hex）",
    output: "PSBT 解码结果",
    empty: "粘贴一段 base64 或 hex 格式的 PSBT。",
    invalid: "请输入合法的 base64 或 hex 格式 PSBT。",
  },
} as const;

function toHex(bytes: Uint8Array | Buffer | undefined | null) {
  if (!bytes) return null;
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function reverseHex(bytes: Uint8Array | Buffer) {
  return Array.from(bytes).reverse().map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function parsePsbt(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^[0-9a-fA-F]+$/.test(trimmed)) {
    return Psbt.fromHex(trimmed);
  }
  return Psbt.fromBase64(trimmed);
}

function detectAddress(script: Uint8Array | Buffer) {
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
  return JSON.stringify(value, (_, current) => (typeof current === "bigint" ? current.toString() : current), 2);
}

export default function PsbtDecoderTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>("");

  const result = useMemo(() => {
    if (!input.trim()) return { empty: text.empty };

    try {
      const psbt = parsePsbt(input);
      if (!psbt) return { empty: text.empty };

      return {
        output: safeSerialize({
          inputCount: psbt.txInputs.length,
          outputCount: psbt.txOutputs.length,
          inputs: psbt.txInputs.map((txInput, index) => {
            const data = psbt.data.inputs[index];
            return {
              index,
              prevTxid: reverseHex(txInput.hash),
              vout: txInput.index,
              sequence: txInput.sequence,
              hasWitnessUtxo: Boolean(data.witnessUtxo),
              witnessUtxoValue: data.witnessUtxo?.value?.toString() ?? null,
              witnessUtxoScriptHex: toHex(data.witnessUtxo?.script) ?? null,
              hasNonWitnessUtxo: Boolean(data.nonWitnessUtxo),
              redeemScriptHex: toHex(data.redeemScript),
              witnessScriptHex: toHex(data.witnessScript),
              partialSignatureCount: data.partialSig?.length ?? 0,
              sighashType: data.sighashType ?? null,
              finalized: Boolean(data.finalScriptSig || data.finalScriptWitness),
              finalScriptSigHex: toHex(data.finalScriptSig),
              finalScriptWitnessHex: toHex(data.finalScriptWitness),
              tapKeySigHex: toHex(data.tapKeySig),
              bip32DerivationCount: data.bip32Derivation?.length ?? 0,
              tapBip32DerivationCount: data.tapBip32Derivation?.length ?? 0,
              unknownKeyValueCount: data.unknownKeyVals?.length ?? 0,
            };
          }),
          outputs: psbt.txOutputs.map((txOutput, index) => {
            const data = psbt.data.outputs[index];
            return {
              index,
              value: txOutput.value.toString(),
              scriptHex: toHex(txOutput.script),
              scriptAsm: btcScript.toASM(txOutput.script),
              address: detectAddress(txOutput.script),
              redeemScriptHex: toHex(data.redeemScript),
              witnessScriptHex: toHex(data.witnessScript),
              bip32DerivationCount: data.bip32Derivation?.length ?? 0,
              tapBip32DerivationCount: data.tapBip32Derivation?.length ?? 0,
              unknownKeyValueCount: data.unknownKeyVals?.length ?? 0,
            };
          }),
        }),
      };
    } catch {
      return { error: text.invalid };
    }
  }, [input, text.empty, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/psbt-decoder</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="psbt-decoder-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="psbt-decoder-input" value={input} onChange={(event) => setInput(event.target.value)} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.output}</div>
          {"empty" in result ? <p className="text-sm text-[var(--foreground)]/70">{result.empty}</p> : null}
          {"error" in result ? <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p> : null}
          {"output" in result ? <textarea readOnly value={result.output} rows={18} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" /> : null}
        </div>
      </div>
    </section>
  );
}
