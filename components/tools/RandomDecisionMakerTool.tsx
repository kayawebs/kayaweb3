"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "pick one",
    options: "Options (one per line)",
    output: "Decision",
    empty: "Enter at least one option.",
    sample: "Ship it\nWait a day\nAsk for review",
  },
  zh: {
    command: "pick one",
    options: "选项列表（每行一个）",
    output: "随机结果",
    empty: "请至少输入一个选项。",
    sample: "现在就做\n明天再决定\n先找人评审",
  },
} as const;

function pickOption(options: string[]) {
  if (options.length === 0) return "";
  return options[Math.floor(Math.random() * options.length)];
}

export default function RandomDecisionMakerTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [options, setOptions] = useState<string>(text.sample);
  const [selected, setSelected] = useState<string>(() => pickOption(text.sample.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)));

  const items = useMemo(() => options.split(/\r?\n/).map((line) => line.trim()).filter(Boolean), [options]);

  const handleOptionsChange = (value: string) => {
    const nextItems = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    setOptions(value);
    setSelected(pickOption(nextItems));
  };

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/random-decision-maker</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <span className="block text-sm font-medium">{text.options}</span>
          <textarea value={options} onChange={(event) => handleOptionsChange(event.target.value)} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </label>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.output}</div>
          {items.length === 0 ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{text.empty}</p>
          ) : (
            <>
              <div className="rounded border border-[var(--terminal-border)] px-3 py-2 font-mono text-xs text-[var(--terminal-muted)]">{items.length} options</div>
              <textarea readOnly value={selected} rows={6} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
