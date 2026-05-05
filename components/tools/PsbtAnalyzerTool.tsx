"use client";

import { useMemo, useState } from "react";

import { Psbt } from "bitcoinjs-lib";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "analyze psbt",
    input: "PSBT (base64 or hex)",
    output: "PSBT analysis",
    empty: "Paste a PSBT to inspect signing completeness, UTXO coverage, and fee visibility.",
    invalid: "Enter a valid PSBT in base64 or hex format.",
  },
  zh: {
    command: "analyze psbt",
    input: "PSBT（base64 或 hex）",
    output: "PSBT 分析结果",
    empty: "粘贴一段 PSBT，查看签名完成度、UTXO 覆盖情况和手续费可见性。",
    invalid: "请输入合法的 base64 或 hex 格式 PSBT。",
  },
} as const;

function parsePsbt(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^[0-9a-fA-F]+$/.test(trimmed)) {
    return Psbt.fromHex(trimmed);
  }
  return Psbt.fromBase64(trimmed);
}

function safeSerialize(value: unknown) {
  return JSON.stringify(value, (_, current) => (typeof current === "bigint" ? current.toString() : current), 2);
}

export default function PsbtAnalyzerTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>("");

  const result = useMemo(() => {
    if (!input.trim()) return { empty: text.empty };

    try {
      const psbt = parsePsbt(input);
      if (!psbt) return { empty: text.empty };

      const inputSummaries = psbt.data.inputs.map((data, index) => ({
        index,
        signed: Boolean(data.tapKeySig) || (data.partialSig?.length ?? 0) > 0,
        finalized: Boolean(data.finalScriptSig || data.finalScriptWitness),
        hasUtxo: Boolean(data.witnessUtxo || data.nonWitnessUtxo),
        utxoValue: data.witnessUtxo ? Number(data.witnessUtxo.value) : null,
        hasUnknowns: (data.unknownKeyVals?.length ?? 0) > 0,
      }));

      const totalInputValue = inputSummaries.reduce((sum, item) => sum + (item.utxoValue ?? 0), 0);
      const totalOutputValue = psbt.txOutputs.reduce((sum, output) => sum + Number(output.value), 0);
      const inputsWithKnownValue = inputSummaries.filter((item) => item.utxoValue !== null).length;
      const feeKnown = inputsWithKnownValue === inputSummaries.length;
      const fee = feeKnown ? totalInputValue - totalOutputValue : null;
      const signedInputs = inputSummaries.filter((item) => item.signed).length;
      const finalizedInputs = inputSummaries.filter((item) => item.finalized).length;
      const missingUtxoInputs = inputSummaries.filter((item) => !item.hasUtxo).length;
      const warnings: string[] = [];

      if (missingUtxoInputs > 0) warnings.push(`missing_utxo_for_${missingUtxoInputs}_inputs`);
      if (signedInputs < inputSummaries.length) warnings.push("not_all_inputs_signed");
      if (finalizedInputs < inputSummaries.length) warnings.push("not_all_inputs_finalized");
      if (feeKnown && typeof fee === "number" && fee < 0) warnings.push("negative_fee_detected");

      return {
        output: safeSerialize({
          inputCount: inputSummaries.length,
          outputCount: psbt.txOutputs.length,
          signedInputs,
          finalizedInputs,
          missingUtxoInputs,
          fullySigned: signedInputs === inputSummaries.length,
          fullyFinalized: finalizedInputs === inputSummaries.length,
          feeKnown,
          totalInputValueSats: feeKnown ? totalInputValue.toString() : null,
          totalOutputValueSats: totalOutputValue.toString(),
          estimatedFeeSats: feeKnown && fee !== null ? fee.toString() : null,
          warnings,
        }),
      };
    } catch {
      return { error: text.invalid };
    }
  }, [input, text.empty, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/psbt-analyzer</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="psbt-analyzer-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="psbt-analyzer-input" value={input} onChange={(event) => setInput(event.target.value)} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
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
