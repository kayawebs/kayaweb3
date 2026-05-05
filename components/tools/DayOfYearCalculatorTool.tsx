"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86400000);
}

const TEXT = {
  en: {
    command: "date +%j",
    date: "Date",
    invalid: "Pick a valid date.",
    dayOfYear: "day of year",
    daysLeft: "days left in year",
    yearType: "year type",
    leap: "leap year",
    common: "common year",
  },
  zh: {
    command: "date +%j",
    date: "日期",
    invalid: "请选择有效日期。",
    dayOfYear: "一年中的第几天",
    daysLeft: "本年剩余天数",
    yearType: "年份类型",
    leap: "闰年",
    common: "平年",
  },
} as const;

export default function DayOfYearCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState("2026-05-02");

  const result = useMemo(() => {
    const date = new Date(`${input}T00:00:00`);
    if (Number.isNaN(date.getTime())) return { error: text.invalid };
    const leap = isLeapYear(date.getFullYear());
    const dayOfYear = getDayOfYear(date);
    const totalDays = leap ? 366 : 365;

    return {
      dayOfYear,
      daysLeft: totalDays - dayOfYear,
      yearType: leap ? text.leap : text.common,
    };
  }, [input, text.common, text.invalid, text.leap]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/day-of-year-calculator</span>
        <span>{text.command}</span>
      </div>

      <div className="space-y-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <label htmlFor="day-of-year-input" className="block text-sm font-medium">
          {text.date}
        </label>
        <input id="day-of-year-input" type="date" value={input} onChange={(e) => setInput(e.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]" />
      </div>

      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.dayOfYear}</div>
            <div className="mt-1 font-mono text-lg">{result.dayOfYear}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.daysLeft}</div>
            <div className="mt-1 font-mono text-lg">{result.daysLeft}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.yearType}</div>
            <div className="mt-1 text-sm">{result.yearType}</div>
          </div>
        </div>
      )}
    </section>
  );
}
