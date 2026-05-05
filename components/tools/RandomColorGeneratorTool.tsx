"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "color-rand",
    count: "Count",
    output: "Generated palette",
  },
  zh: {
    command: "color-rand",
    count: "数量",
    output: "生成调色板",
  },
} as const;

function generateHexColor() {
  const value = Math.floor(Math.random() * 0xffffff);
  return `#${value.toString(16).padStart(6, "0")}`;
}

export default function RandomColorGeneratorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [count, setCount] = useState(6);

  const colors = useMemo(() => {
    const safeCount = Math.min(Math.max(count, 1), 24);
    return Array.from({ length: safeCount }, () => generateHexColor());
  }, [count]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/random-color-generator</span>
        <span>{text.command}</span>
      </div>
      <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
        <span className="block text-sm font-medium">{text.count}</span>
        <input type="number" min={1} max={24} value={count} onChange={(event) => setCount(Number(event.target.value) || 1)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
      </label>
      <div className="space-y-3">
        <div className="text-sm font-medium">{text.output}</div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {colors.map((color) => (
            <div key={color} className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-3">
              <div className="h-20 rounded border border-[var(--terminal-border)]" style={{ backgroundColor: color }} />
              <div className="mt-3 font-mono text-sm">{color}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
