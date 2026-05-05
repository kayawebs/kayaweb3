"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "spin wheel",
    options: "Options (one per line)",
    spin: "Spin",
    result: "Selected option",
    empty: "Enter at least one option to spin.",
    sample: "Build\nWrite\nReview\nShip",
  },
  zh: {
    command: "spin wheel",
    options: "选项列表（每行一个）",
    spin: "开始转盘",
    result: "选中结果",
    empty: "请至少输入一个选项。",
    sample: "构建\n写作\n评审\n发布",
  },
} as const;

function pickRandom(items: string[]) {
  if (items.length === 0) return "";
  return items[Math.floor(Math.random() * items.length)];
}

export default function SpinWheelPickerTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [options, setOptions] = useState<string>(text.sample);
  const [result, setResult] = useState("");
  const [spins, setSpins] = useState(0);

  const items = useMemo(() => options.split(/\r?\n/).map((line) => line.trim()).filter(Boolean), [options]);

  const handleSpin = () => {
    if (items.length === 0) return;
    setResult(pickRandom(items));
    setSpins((value) => value + 1);
  };

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/spin-wheel-picker</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <span className="block text-sm font-medium">{text.options}</span>
          <textarea value={options} onChange={(event) => setOptions(event.target.value)} rows={10} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </label>
        <div className="space-y-4 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <button type="button" onClick={handleSpin} className="w-full rounded-lg border border-[var(--terminal-accent)] bg-[var(--terminal-panel-bg)]/40 px-4 py-6 font-mono text-lg hover:bg-[var(--terminal-panel-bg)]/70">
            {text.spin}
          </button>
          {items.length === 0 ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{text.empty}</p>
          ) : (
            <>
              <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/20 p-4">
                <div className="text-sm font-medium">{text.result}</div>
                <div className="mt-2 font-mono text-xl">{result || "-"}</div>
              </div>
              <div className="text-xs font-mono text-[var(--terminal-muted)]">spins: {spins}</div>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span key={item} className={`rounded border px-2 py-1 text-xs font-mono ${item === result ? "border-[var(--terminal-accent)] text-[var(--terminal-accent)]" : "border-[var(--terminal-border)] text-[var(--terminal-muted)]"}`}>
                    {item}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
