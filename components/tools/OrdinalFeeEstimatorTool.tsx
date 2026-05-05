"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

type OutputType = "p2wpkh" | "p2tr";

const REVEAL_BASE_VBYTES: Record<OutputType, number> = {
  p2wpkh: 110,
  p2tr: 95,
};

const COMMIT_VBYTES: Record<OutputType, number> = {
  p2wpkh: 160,
  p2tr: 140,
};

const TEXT = {
  en: {
    command: "estimate inscription fees",
    contentBytes: "Inscription content bytes",
    feeRate: "Fee rate (sat/vB)",
    outputType: "Reveal output type",
    postage: "Postage (sats)",
    commitFee: "Estimated commit fee",
    revealFee: "Estimated reveal fee",
    totalFee: "Estimated total fee",
    totalCost: "Fee + postage",
    revealVbytes: "Estimated reveal vbytes",
    invalid: "Enter non-negative content bytes, postage, and a positive fee rate.",
    p2wpkh: "P2WPKH",
    p2tr: "P2TR",
  },
  zh: {
    command: "estimate inscription fees",
    contentBytes: "铭文字节数",
    feeRate: "费率（sat/vB）",
    outputType: "Reveal 输出类型",
    postage: "Postage（sats）",
    commitFee: "预估 commit 手续费",
    revealFee: "预估 reveal 手续费",
    totalFee: "预估总手续费",
    totalCost: "手续费 + postage",
    revealVbytes: "预估 reveal vbytes",
    invalid: "请输入非负铭文字节数、postage，以及正数费率。",
    p2wpkh: "P2WPKH",
    p2tr: "P2TR",
  },
} as const;

export default function OrdinalFeeEstimatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [contentBytes, setContentBytes] = useState<string>("2048");
  const [feeRate, setFeeRate] = useState<string>("10");
  const [postage, setPostage] = useState<string>("546");
  const [outputType, setOutputType] = useState<OutputType>("p2tr");

  const result = useMemo(() => {
    const contentValue = Number.parseFloat(contentBytes);
    const feeRateValue = Number.parseFloat(feeRate);
    const postageValue = Number.parseFloat(postage);

    if (
      !Number.isFinite(contentValue) ||
      !Number.isFinite(feeRateValue) ||
      !Number.isFinite(postageValue) ||
      contentValue < 0 ||
      feeRateValue <= 0 ||
      postageValue < 0
    ) {
      return { error: text.invalid };
    }

    const revealVbytes = REVEAL_BASE_VBYTES[outputType] + Math.ceil(contentValue / 4) + contentValue;
    const commitFee = Math.ceil(COMMIT_VBYTES[outputType] * feeRateValue);
    const revealFee = Math.ceil(revealVbytes * feeRateValue);
    const totalFee = commitFee + revealFee;
    const totalCost = totalFee + postageValue;

    return {
      revealVbytes: revealVbytes.toString(),
      commitFee: commitFee.toString(),
      revealFee: revealFee.toString(),
      totalFee: totalFee.toString(),
      totalCost: totalCost.toString(),
    };
  }, [contentBytes, feeRate, outputType, postage, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/ordinal-fee-estimator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <span className="block text-sm font-medium">{text.contentBytes}</span>
          <input type="text" value={contentBytes} onChange={(event) => setContentBytes(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <span className="block text-sm font-medium">{text.feeRate}</span>
          <input type="text" value={feeRate} onChange={(event) => setFeeRate(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <span className="block text-sm font-medium">{text.postage}</span>
          <input type="text" value={postage} onChange={(event) => setPostage(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <span className="block text-sm font-medium">{text.outputType}</span>
          <select value={outputType} onChange={(event) => setOutputType(event.target.value as OutputType)} className="w-full rounded border border-[var(--terminal-border)] bg-[var(--background)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]">
            <option value="p2wpkh">{text.p2wpkh}</option>
            <option value="p2tr">{text.p2tr}</option>
          </select>
        </label>
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-5">
          {([
            [text.revealVbytes, result.revealVbytes],
            [text.commitFee, result.commitFee],
            [text.revealFee, result.revealFee],
            [text.totalFee, result.totalFee],
            [text.totalCost, result.totalCost],
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
