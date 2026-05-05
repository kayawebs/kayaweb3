"use client";

import { useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "flip coin",
    flip: "Flip coin",
    result: "Result",
    streak: "Total flips",
    heads: "Heads",
    tails: "Tails",
    idle: "Click to flip.",
  },
  zh: {
    command: "flip coin",
    flip: "抛硬币",
    result: "结果",
    streak: "总次数",
    heads: "正面",
    tails: "反面",
    idle: "点击开始抛硬币。",
  },
} as const;

export default function CoinFlipSimulatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [result, setResult] = useState<string>(text.idle);
  const [headsCount, setHeadsCount] = useState(0);
  const [tailsCount, setTailsCount] = useState(0);

  const handleFlip = () => {
    const next = Math.random() < 0.5 ? text.heads : text.tails;
    setResult(next);
    if (next === text.heads) {
      setHeadsCount((value) => value + 1);
    } else {
      setTailsCount((value) => value + 1);
    }
  };

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/coin-flip-simulator</span>
        <span>{text.command}</span>
      </div>
      <button type="button" onClick={handleFlip} className="w-full rounded-lg border border-[var(--terminal-accent)] bg-[var(--terminal-panel-bg)]/40 px-4 py-6 text-center font-mono text-lg hover:bg-[var(--terminal-panel-bg)]/70">
        {text.flip}
      </button>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.result}</div>
          <div className="mt-2 font-mono text-lg">{result}</div>
        </div>
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.heads}</div>
          <div className="mt-2 font-mono text-lg">{headsCount}</div>
        </div>
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.tails}</div>
          <div className="mt-2 font-mono text-lg">{tailsCount}</div>
        </div>
      </div>
      <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4 text-xs font-mono text-[var(--terminal-muted)]">
        {text.streak}: {headsCount + tailsCount}
      </div>
    </section>
  );
}
