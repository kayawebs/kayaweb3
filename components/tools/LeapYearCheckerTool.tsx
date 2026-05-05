"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

const TEXT = {
  en: {
    command: "cal 2028",
    year: "Year",
    invalid: "Enter a valid year.",
    result: "result",
    leap: "Leap year",
    common: "Common year",
    febDays: "days in February",
    totalDays: "days in year",
    rule: "rule matched",
  },
  zh: {
    command: "cal 2028",
    year: "年份",
    invalid: "请输入有效年份。",
    result: "结果",
    leap: "闰年",
    common: "平年",
    febDays: "2 月天数",
    totalDays: "全年天数",
    rule: "判定规则",
  },
} as const;

export default function LeapYearCheckerTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [yearInput, setYearInput] = useState("2028");

  const result = useMemo(() => {
    const year = Number(yearInput);
    if (!Number.isInteger(year) || year < 0) return { error: text.invalid };
    const leap = isLeapYear(year);

    let rule: string;
    if (year % 400 === 0) rule = locale === "zh" ? "可被 400 整除" : "divisible by 400";
    else if (year % 100 === 0) rule = locale === "zh" ? "可被 100 整除但不可被 400 整除" : "divisible by 100 but not 400";
    else if (year % 4 === 0) rule = locale === "zh" ? "可被 4 整除且不可被 100 整除" : "divisible by 4 but not 100";
    else rule = locale === "zh" ? "不可被 4 整除" : "not divisible by 4";

    return {
      result: leap ? text.leap : text.common,
      febDays: leap ? 29 : 28,
      totalDays: leap ? 366 : 365,
      rule,
    };
  }, [locale, text.common, text.invalid, text.leap, yearInput]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/leap-year-checker</span>
        <span>{text.command}</span>
      </div>

      <div className="space-y-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <label htmlFor="leap-year-input" className="block text-sm font-medium">
          {text.year}
        </label>
        <input
          id="leap-year-input"
          value={yearInput}
          onChange={(e) => setYearInput(e.target.value)}
          inputMode="numeric"
          className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]"
        />
      </div>

      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.result}</div>
            <div className="mt-1 text-sm">{result.result}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.febDays}</div>
            <div className="mt-1 font-mono text-lg">{result.febDays}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.totalDays}</div>
            <div className="mt-1 font-mono text-lg">{result.totalDays}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.rule}</div>
            <div className="mt-1 text-sm">{result.rule}</div>
          </div>
        </div>
      )}
    </section>
  );
}
