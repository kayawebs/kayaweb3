"use client";

import { useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "roll dice",
    count: "Dice count",
    roll: "Roll dice",
    total: "Total",
    values: "Values",
  },
  zh: {
    command: "roll dice",
    count: "骰子数量",
    roll: "掷骰子",
    total: "总点数",
    values: "结果",
  },
} as const;

function rollOne() {
  return Math.floor(Math.random() * 6) + 1;
}

export default function DiceRollSimulatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [diceCount, setDiceCount] = useState(2);
  const [values, setValues] = useState<number[]>([1, 1]);

  const handleRoll = () => {
    const count = Math.min(Math.max(diceCount, 1), 6);
    setValues(Array.from({ length: count }, () => rollOne()));
  };

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/dice-roll-simulator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <span className="block text-sm font-medium">{text.count}</span>
          <input type="number" min={1} max={6} value={diceCount} onChange={(event) => setDiceCount(Number(event.target.value) || 1)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </label>
        <button type="button" onClick={handleRoll} className="rounded-lg border border-[var(--terminal-accent)] bg-[var(--terminal-panel-bg)]/40 px-4 py-6 text-center font-mono text-lg hover:bg-[var(--terminal-panel-bg)]/70">
          {text.roll}
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.values}</div>
          <div className="mt-2 font-mono text-lg">{values.join(" / ")}</div>
        </div>
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.total}</div>
          <div className="mt-2 font-mono text-lg">{values.reduce((sum, value) => sum + value, 0)}</div>
        </div>
      </div>
    </section>
  );
}
