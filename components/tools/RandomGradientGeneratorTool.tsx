"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "gradient-gen",
    count: "Count",
    output: "Generated gradients",
  },
  zh: {
    command: "gradient-gen",
    count: "数量",
    output: "生成渐变",
  },
} as const;

function generateHexColor() {
  const value = Math.floor(Math.random() * 0xffffff);
  return `#${value.toString(16).padStart(6, "0")}`;
}

function generateGradient() {
  const c1 = generateHexColor();
  const c2 = generateHexColor();
  const c3 = generateHexColor();
  const angle = Math.floor(Math.random() * 360);
  return `linear-gradient(${angle}deg, ${c1}, ${c2}, ${c3})`;
}

export default function RandomGradientGeneratorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [count, setCount] = useState(4);

  const gradients = useMemo(() => {
    const safeCount = Math.min(Math.max(count, 1), 12);
    return Array.from({ length: safeCount }, () => generateGradient());
  }, [count]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/random-gradient-generator</span>
        <span>{text.command}</span>
      </div>
      <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
        <span className="block text-sm font-medium">{text.count}</span>
        <input type="number" min={1} max={12} value={count} onChange={(event) => setCount(Number(event.target.value) || 1)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
      </label>
      <div className="space-y-3">
        <div className="text-sm font-medium">{text.output}</div>
        <div className="grid gap-3 lg:grid-cols-2">
          {gradients.map((gradient) => (
            <div key={gradient} className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-3">
              <div className="h-28 rounded border border-[var(--terminal-border)]" style={{ backgroundImage: gradient }} />
              <textarea readOnly value={gradient} rows={3} className="mt-3 w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
