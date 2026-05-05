"use client";

import { useMemo, useState } from "react";

import { getBytes, isHexString } from "ethers";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "analyze gas overhead",
    gasUsed: "Gas used",
    gasPriceGwei: "Gas price (gwei)",
    calldata: "Calldata hex",
    potentialGasCut: "Potential gas cut",
    currentCost: "Current fee cost (ETH)",
    calldataBytes: "Calldata bytes",
    zeroBytes: "Zero bytes",
    nonZeroBytes: "Non-zero bytes",
    intrinsicGas: "Intrinsic calldata gas",
    optimizedCost: "Fee after gas cut (ETH)",
    savings: "Estimated savings (ETH)",
    invalid: "Enter non-negative gas values and a valid 0x-prefixed calldata hex string.",
  },
  zh: {
    command: "analyze gas overhead",
    gasUsed: "已用 gas",
    gasPriceGwei: "Gas 价格（gwei）",
    calldata: "Calldata hex",
    potentialGasCut: "潜在 gas 降幅",
    currentCost: "当前手续费成本（ETH）",
    calldataBytes: "Calldata 字节数",
    zeroBytes: "零字节数",
    nonZeroBytes: "非零字节数",
    intrinsicGas: "Calldata 固有 gas",
    optimizedCost: "降耗后手续费（ETH）",
    savings: "预估节省（ETH）",
    invalid: "请输入非负 gas 值以及合法的 0x 前缀 calldata hex 字符串。",
  },
} as const;

function formatEth(value: number) {
  return value.toFixed(8).replace(/\.?0+$/, "");
}

export default function GasOptimizationAnalyzerTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [gasUsed, setGasUsed] = useState<string>("150000");
  const [gasPriceGwei, setGasPriceGwei] = useState<string>("5");
  const [potentialGasCut, setPotentialGasCut] = useState<string>("12");
  const [calldata, setCalldata] = useState<string>("0x");

  const result = useMemo(() => {
    const gasUsedValue = Number.parseFloat(gasUsed);
    const gasPriceValue = Number.parseFloat(gasPriceGwei);
    const gasCutValue = Number.parseFloat(potentialGasCut);
    const trimmed = calldata.trim();

    if (
      !Number.isFinite(gasUsedValue) ||
      !Number.isFinite(gasPriceValue) ||
      !Number.isFinite(gasCutValue) ||
      gasUsedValue < 0 ||
      gasPriceValue < 0 ||
      gasCutValue < 0 ||
      !isHexString(trimmed)
    ) {
      return { error: text.invalid };
    }

    const bytes = getBytes(trimmed);
    const zeroBytes = Array.from(bytes).filter((byte) => byte === 0).length;
    const nonZeroBytes = bytes.length - zeroBytes;
    const intrinsicGas = zeroBytes * 4 + nonZeroBytes * 16;
    const currentCostEth = (gasUsedValue * gasPriceValue) / 1_000_000_000;
    const optimizedCostEth = (gasUsedValue * (1 - gasCutValue / 100) * gasPriceValue) / 1_000_000_000;
    const savingsEth = currentCostEth - optimizedCostEth;

    return {
      calldataBytes: bytes.length.toString(),
      zeroBytes: zeroBytes.toString(),
      nonZeroBytes: nonZeroBytes.toString(),
      intrinsicGas: intrinsicGas.toString(),
      currentCostEth: formatEth(currentCostEth),
      optimizedCostEth: formatEth(optimizedCostEth),
      savingsEth: formatEth(savingsEth),
    };
  }, [calldata, gasPriceGwei, gasUsed, potentialGasCut, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/gas-optimization-analyzer</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        {([
          [text.gasUsed, gasUsed, setGasUsed],
          [text.gasPriceGwei, gasPriceGwei, setGasPriceGwei],
          [text.potentialGasCut, potentialGasCut, setPotentialGasCut],
        ] as const).map(([label, value, setter]) => (
          <label key={label} className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <span className="block text-sm font-medium">{label}</span>
            <input type="text" value={value} onChange={(event) => setter(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
          </label>
        ))}
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 lg:col-span-4">
          <span className="block text-sm font-medium">{text.calldata}</span>
          <textarea value={calldata} onChange={(event) => setCalldata(event.target.value)} rows={6} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </label>
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-4">
          {([
            [text.calldataBytes, result.calldataBytes],
            [text.zeroBytes, result.zeroBytes],
            [text.nonZeroBytes, result.nonZeroBytes],
            [text.intrinsicGas, result.intrinsicGas],
            [text.currentCost, result.currentCostEth],
            [text.optimizedCost, result.optimizedCostEth],
            [text.savings, result.savingsEth],
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
