"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "shuf",
    min: "Minimum",
    max: "Maximum",
    count: "Count",
    decimals: "Decimals",
    unique: "Unique values",
    output: "Generated numbers",
    invalid: "Enter valid bounds. Maximum must be greater than or equal to minimum.",
    uniqueInvalid: "Unique generation requires an integer range large enough for the requested count.",
  },
  zh: {
    command: "shuf",
    min: "最小值",
    max: "最大值",
    count: "数量",
    decimals: "小数位",
    unique: "结果不重复",
    output: "生成结果",
    invalid: "请输入合法范围，且最大值必须大于或等于最小值。",
    uniqueInvalid: "不重复模式要求整数区间足够大，能够容纳所需数量。",
  },
} as const;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number) {
  return (Math.random() * (max - min) + min).toFixed(decimals);
}

export default function RandomNumberGeneratorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("5");
  const [decimals, setDecimals] = useState("0");
  const [unique, setUnique] = useState(false);

  const result = useMemo(() => {
    const minValue = Number.parseFloat(min);
    const maxValue = Number.parseFloat(max);
    const countValue = Math.min(Math.max(Number.parseInt(count, 10) || 1, 1), 50);
    const decimalsValue = Math.min(Math.max(Number.parseInt(decimals, 10) || 0, 0), 8);

    if (!Number.isFinite(minValue) || !Number.isFinite(maxValue) || minValue > maxValue) {
      return { error: text.invalid };
    }

    if (unique) {
      const minInt = Math.ceil(minValue);
      const maxInt = Math.floor(maxValue);
      const rangeSize = maxInt - minInt + 1;
      if (decimalsValue !== 0 || rangeSize < countValue || rangeSize <= 0) {
        return { error: text.uniqueInvalid };
      }

      const picked = new Set<number>();
      while (picked.size < countValue) {
        picked.add(randomInt(minInt, maxInt));
      }
      return { values: Array.from(picked).map(String) };
    }

    return {
      values: Array.from({ length: countValue }, () =>
        decimalsValue === 0 ? String(randomInt(Math.ceil(minValue), Math.floor(maxValue))) : randomFloat(minValue, maxValue, decimalsValue),
      ),
    };
  }, [count, decimals, max, min, text.invalid, text.uniqueInvalid, unique]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/random-number-generator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {([
          [text.min, min, setMin],
          [text.max, max, setMax],
          [text.count, count, setCount],
          [text.decimals, decimals, setDecimals],
        ] as const).map(([label, value, setter]) => (
          <label key={label} className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
            <span className="block text-sm font-medium">{label}</span>
            <input value={value} onChange={(event) => setter(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
          </label>
        ))}
      </div>
      <label className="flex items-center gap-2 rounded border border-[var(--terminal-border)] px-3 py-2 text-sm">
        <input type="checkbox" checked={unique} onChange={(event) => setUnique(event.target.checked)} />
        <span>{text.unique}</span>
      </label>
      <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <div className="text-sm font-medium">{text.output}</div>
        {"error" in result ? (
          <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
        ) : (
          <textarea readOnly value={result.values.join("\n")} rows={10} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
        )}
      </div>
    </section>
  );
}
