"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?";

const TEXT = {
  en: {
    command: "pwgen",
    length: "Length",
    count: "Count",
    symbols: "Include symbols",
    output: "Generated passwords",
  },
  zh: {
    command: "pwgen",
    length: "长度",
    count: "数量",
    symbols: "包含符号",
    output: "生成密码",
  },
} as const;

function generatePassword(length: number, includeSymbols: boolean) {
  const charset = LOWER + UPPER + NUMBERS + (includeSymbols ? SYMBOLS : "");
  const seed = new Uint32Array(length);
  crypto.getRandomValues(seed);
  return Array.from(seed, (value) => charset[value % charset.length]).join("");
}

export default function RandomPasswordGeneratorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [length, setLength] = useState(20);
  const [count, setCount] = useState(5);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const output = useMemo(() => {
    const safeLength = Math.min(Math.max(length, 4), 128);
    const safeCount = Math.min(Math.max(count, 1), 20);
    return Array.from({ length: safeCount }, () => generatePassword(safeLength, includeSymbols)).join("\n");
  }, [count, includeSymbols, length]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/random-password-generator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <span className="block text-sm font-medium">{text.length}</span>
          <input type="number" min={4} max={128} value={length} onChange={(event) => setLength(Number(event.target.value) || 4)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <span className="block text-sm font-medium">{text.count}</span>
          <input type="number" min={1} max={20} value={count} onChange={(event) => setCount(Number(event.target.value) || 1)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </label>
      </div>
      <label className="flex items-center gap-2 rounded border border-[var(--terminal-border)] px-3 py-2 text-sm">
        <input type="checkbox" checked={includeSymbols} onChange={(event) => setIncludeSymbols(event.target.checked)} />
        <span>{text.symbols}</span>
      </label>
      <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <div className="text-sm font-medium">{text.output}</div>
        <textarea readOnly value={output} rows={10} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
      </div>
    </section>
  );
}
