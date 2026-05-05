"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const INPUT_BASE_BYTES = {
  p2pkh: 148,
  p2wpkh: 41,
  p2shP2wpkh: 64,
  p2tr: 41,
} as const;

const INPUT_WITNESS_BYTES = {
  p2pkh: 0,
  p2wpkh: 107,
  p2shP2wpkh: 108,
  p2tr: 66,
} as const;

const OUTPUT_BYTES = {
  p2pkh: 34,
  p2sh: 32,
  p2wpkh: 31,
  p2tr: 43,
} as const;

const TEXT = {
  en: {
    command: "estimate weight",
    inputs: "Inputs",
    outputs: "Outputs",
    p2pkh: "P2PKH",
    p2wpkh: "P2WPKH",
    p2shP2wpkh: "P2SH-P2WPKH",
    p2tr: "P2TR",
    p2sh: "P2SH",
    weight: "Estimated weight units",
    vbytes: "Estimated vbytes",
    bytes: "Estimated total bytes",
    baseBytes: "Base bytes",
    witnessBytes: "Witness bytes",
    invalid: "All counts must be non-negative integers.",
  },
  zh: {
    command: "estimate weight",
    inputs: "输入",
    outputs: "输出",
    p2pkh: "P2PKH",
    p2wpkh: "P2WPKH",
    p2shP2wpkh: "P2SH-P2WPKH",
    p2tr: "P2TR",
    p2sh: "P2SH",
    weight: "估算权重单位",
    vbytes: "估算 vbytes",
    bytes: "估算总字节",
    baseBytes: "基础字节",
    witnessBytes: "见证字节",
    invalid: "所有数量都必须是非负整数。",
  },
} as const;

function varIntSize(value: number) {
  if (value < 0xfd) return 1;
  if (value <= 0xffff) return 3;
  if (value <= 0xffffffff) return 5;
  return 9;
}

export default function BtcWeightCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [inputs, setInputs] = useState({
    p2pkh: "0",
    p2wpkh: "1",
    p2shP2wpkh: "0",
    p2tr: "0",
  });
  const [outputs, setOutputs] = useState({
    p2pkh: "0",
    p2sh: "0",
    p2wpkh: "2",
    p2tr: "0",
  });

  const result = useMemo(() => {
    const allValues = [...Object.values(inputs), ...Object.values(outputs)];
    if (!allValues.every((value) => /^\d+$/.test(value))) {
      return { error: text.invalid };
    }

    const parsedInputs = {
      p2pkh: Number.parseInt(inputs.p2pkh, 10),
      p2wpkh: Number.parseInt(inputs.p2wpkh, 10),
      p2shP2wpkh: Number.parseInt(inputs.p2shP2wpkh, 10),
      p2tr: Number.parseInt(inputs.p2tr, 10),
    };
    const parsedOutputs = {
      p2pkh: Number.parseInt(outputs.p2pkh, 10),
      p2sh: Number.parseInt(outputs.p2sh, 10),
      p2wpkh: Number.parseInt(outputs.p2wpkh, 10),
      p2tr: Number.parseInt(outputs.p2tr, 10),
    };

    const totalInputs = Object.values(parsedInputs).reduce((sum, value) => sum + value, 0);
    const totalOutputs = Object.values(parsedOutputs).reduce((sum, value) => sum + value, 0);
    const hasWitness = parsedInputs.p2wpkh + parsedInputs.p2shP2wpkh + parsedInputs.p2tr > 0;

    const baseBytes =
      4 +
      varIntSize(totalInputs) +
      varIntSize(totalOutputs) +
      4 +
      parsedInputs.p2pkh * INPUT_BASE_BYTES.p2pkh +
      parsedInputs.p2wpkh * INPUT_BASE_BYTES.p2wpkh +
      parsedInputs.p2shP2wpkh * INPUT_BASE_BYTES.p2shP2wpkh +
      parsedInputs.p2tr * INPUT_BASE_BYTES.p2tr +
      parsedOutputs.p2pkh * OUTPUT_BYTES.p2pkh +
      parsedOutputs.p2sh * OUTPUT_BYTES.p2sh +
      parsedOutputs.p2wpkh * OUTPUT_BYTES.p2wpkh +
      parsedOutputs.p2tr * OUTPUT_BYTES.p2tr;

    const witnessBytes =
      (hasWitness ? 2 : 0) +
      parsedInputs.p2pkh * INPUT_WITNESS_BYTES.p2pkh +
      parsedInputs.p2wpkh * INPUT_WITNESS_BYTES.p2wpkh +
      parsedInputs.p2shP2wpkh * INPUT_WITNESS_BYTES.p2shP2wpkh +
      parsedInputs.p2tr * INPUT_WITNESS_BYTES.p2tr;

    const totalBytes = baseBytes + witnessBytes;
    const weight = baseBytes * 4 + witnessBytes;
    const vbytes = Math.ceil(weight / 4);

    return {
      baseBytes: baseBytes.toString(),
      witnessBytes: witnessBytes.toString(),
      bytes: totalBytes.toString(),
      weight: weight.toString(),
      vbytes: vbytes.toString(),
    };
  }, [inputs, outputs, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/btc-weight-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.inputs}</div>
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              ["p2pkh", text.p2pkh],
              ["p2wpkh", text.p2wpkh],
              ["p2shP2wpkh", text.p2shP2wpkh],
              ["p2tr", text.p2tr],
            ] as const).map(([key, label]) => (
              <label key={key} className="space-y-2">
                <span className="block text-xs font-mono text-[var(--terminal-muted)]">{label}</span>
                <input
                  type="text"
                  value={inputs[key]}
                  onChange={(event) => setInputs((current) => ({ ...current, [key]: event.target.value }))}
                  className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
                />
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.outputs}</div>
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              ["p2pkh", text.p2pkh],
              ["p2sh", text.p2sh],
              ["p2wpkh", text.p2wpkh],
              ["p2tr", text.p2tr],
            ] as const).map(([key, label]) => (
              <label key={key} className="space-y-2">
                <span className="block text-xs font-mono text-[var(--terminal-muted)]">{label}</span>
                <input
                  type="text"
                  value={outputs[key]}
                  onChange={(event) => setOutputs((current) => ({ ...current, [key]: event.target.value }))}
                  className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-5">
          {([
            [text.baseBytes, result.baseBytes],
            [text.witnessBytes, result.witnessBytes],
            [text.bytes, result.bytes],
            [text.weight, result.weight],
            [text.vbytes, result.vbytes],
          ] as const).map(([label, value]) => (
            <div key={label} className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
              <div className="text-sm font-medium">{label}</div>
              <textarea readOnly value={value} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
