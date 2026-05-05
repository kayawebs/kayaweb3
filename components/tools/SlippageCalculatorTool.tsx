"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "check slippage",
    expected: "Expected output",
    actual: "Actual output",
    tolerance: "Slippage tolerance (%)",
    minReceived: "Minimum received",
    slippage: "Actual slippage %",
    within: "Within tolerance",
    invalid: "Enter positive output values and a non-negative slippage tolerance.",
    yes: "Yes",
    no: "No",
  },
  zh: {
    command: "check slippage",
    expected: "预期输出",
    actual: "实际输出",
    tolerance: "滑点容忍度（%）",
    minReceived: "最少收到",
    slippage: "实际滑点 %",
    within: "是否在容忍范围内",
    invalid: "请输入正数输出值和非负滑点容忍度。",
    yes: "是",
    no: "否",
  },
} as const;

function format(value: number) {
  return value.toFixed(8).replace(/\.?0+$/, "");
}

export default function SlippageCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [expected, setExpected] = useState<string>("1000");
  const [actual, setActual] = useState<string>("985");
  const [tolerance, setTolerance] = useState<string>("1");

  const result = useMemo(() => {
    const expectedValue = Number.parseFloat(expected);
    const actualValue = Number.parseFloat(actual);
    const toleranceValue = Number.parseFloat(tolerance);

    if (
      !Number.isFinite(expectedValue) ||
      !Number.isFinite(actualValue) ||
      !Number.isFinite(toleranceValue) ||
      expectedValue <= 0 ||
      actualValue <= 0 ||
      toleranceValue < 0
    ) {
      return { error: text.invalid };
    }

    const minReceived = expectedValue * (1 - toleranceValue / 100);
    const slippage = ((expectedValue - actualValue) / expectedValue) * 100;

    return {
      minReceived: format(minReceived),
      slippage: format(slippage),
      within: actualValue >= minReceived ? text.yes : text.no,
    };
  }, [actual, expected, text.invalid, text.no, text.yes, tolerance]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/slippage-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {([
          [text.expected, expected, setExpected],
          [text.actual, actual, setActual],
          [text.tolerance, tolerance, setTolerance],
        ] as const).map(([label, value, setter]) => (
          <label key={label} className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <span className="block text-sm font-medium">{label}</span>
            <input
              type="text"
              value={value}
              onChange={(event) => setter(event.target.value)}
              className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
            />
          </label>
        ))}
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {([
            [text.minReceived, result.minReceived],
            [text.slippage, result.slippage],
            [text.within, result.within],
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
