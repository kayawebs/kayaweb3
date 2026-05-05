"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

type InputType = "p2pkh" | "p2wpkh" | "p2sh-p2wpkh" | "p2tr";
type OutputType = "p2pkh" | "p2sh" | "p2wpkh" | "p2tr";

const INPUT_VBYTES: Record<InputType, number> = {
  p2pkh: 148,
  p2wpkh: 68,
  "p2sh-p2wpkh": 91,
  p2tr: 58,
};

const OUTPUT_VBYTES: Record<OutputType, number> = {
  p2pkh: 34,
  p2sh: 32,
  p2wpkh: 31,
  p2tr: 43,
};

const TEXT = {
  en: {
    command: "estimate vbytes",
    inputType: "Input type",
    inputCount: "Input count",
    outputType: "Output type",
    outputCount: "Output count",
    vbytes: "Estimated vbytes",
    bytes: "Estimated bytes",
    weight: "Estimated weight units",
    invalid: "Counts must be non-negative integers.",
    p2pkh: "P2PKH",
    p2wpkh: "P2WPKH",
    p2shP2wpkh: "P2SH-P2WPKH",
    p2tr: "P2TR",
    p2sh: "P2SH",
  },
  zh: {
    command: "estimate vbytes",
    inputType: "输入类型",
    inputCount: "输入数量",
    outputType: "输出类型",
    outputCount: "输出数量",
    vbytes: "估算 vbytes",
    bytes: "估算 bytes",
    weight: "估算权重单位",
    invalid: "数量必须是非负整数。",
    p2pkh: "P2PKH",
    p2wpkh: "P2WPKH",
    p2shP2wpkh: "P2SH-P2WPKH",
    p2tr: "P2TR",
    p2sh: "P2SH",
  },
} as const;

export default function BtcTransactionSizeCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [inputType, setInputType] = useState<InputType>("p2wpkh");
  const [inputCount, setInputCount] = useState<string>("1");
  const [outputType, setOutputType] = useState<OutputType>("p2wpkh");
  const [outputCount, setOutputCount] = useState<string>("2");

  const result = useMemo(() => {
    if (!/^\d+$/.test(inputCount) || !/^\d+$/.test(outputCount)) {
      return { error: text.invalid };
    }

    const inputs = Number.parseInt(inputCount, 10);
    const outputs = Number.parseInt(outputCount, 10);
    const hasWitness = inputType !== "p2pkh";
    const overheadBytes = hasWitness ? 12 : 10;
    const estimatedVbytes = overheadBytes + inputs * INPUT_VBYTES[inputType] + outputs * OUTPUT_VBYTES[outputType];
    const estimatedWeight = hasWitness ? estimatedVbytes * 4 - 2 : estimatedVbytes * 4;

    return {
      vbytes: estimatedVbytes.toString(),
      bytes: estimatedVbytes.toString(),
      weight: estimatedWeight.toString(),
    };
  }, [inputCount, inputType, outputCount, outputType, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/btc-transaction-size-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="btc-size-input-type" className="block text-sm font-medium">{text.inputType}</label>
          <select id="btc-size-input-type" value={inputType} onChange={(event) => setInputType(event.target.value as InputType)} className="w-full rounded border border-[var(--terminal-border)] bg-[var(--background)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]">
            <option value="p2pkh">{text.p2pkh}</option>
            <option value="p2wpkh">{text.p2wpkh}</option>
            <option value="p2sh-p2wpkh">{text.p2shP2wpkh}</option>
            <option value="p2tr">{text.p2tr}</option>
          </select>
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="btc-size-input-count" className="block text-sm font-medium">{text.inputCount}</label>
          <input id="btc-size-input-count" type="text" value={inputCount} onChange={(event) => setInputCount(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="btc-size-output-type" className="block text-sm font-medium">{text.outputType}</label>
          <select id="btc-size-output-type" value={outputType} onChange={(event) => setOutputType(event.target.value as OutputType)} className="w-full rounded border border-[var(--terminal-border)] bg-[var(--background)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]">
            <option value="p2pkh">{text.p2pkh}</option>
            <option value="p2sh">{text.p2sh}</option>
            <option value="p2wpkh">{text.p2wpkh}</option>
            <option value="p2tr">{text.p2tr}</option>
          </select>
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="btc-size-output-count" className="block text-sm font-medium">{text.outputCount}</label>
          <input id="btc-size-output-count" type="text" value={outputCount} onChange={(event) => setOutputCount(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.vbytes}</div>
            <textarea readOnly value={result.vbytes} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.bytes}</div>
            <textarea readOnly value={result.bytes} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.weight}</div>
            <textarea readOnly value={result.weight} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          </div>
        </div>
      )}
    </section>
  );
}
