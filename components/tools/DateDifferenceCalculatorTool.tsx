"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function toLocalInputValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function parseDateInput(value: string) {
  if (!value.trim()) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

const TEXT = {
  en: {
    command: "date --date='...'",
    start: "Start date and time",
    end: "End date and time",
    setNow: "use now",
    clear: "clear",
    totalDays: "total days",
    totalHours: "total hours",
    totalMinutes: "total minutes",
    totalSeconds: "total seconds",
    breakdown: "breakdown",
    earlier: "earlier",
    later: "later",
    same: "same moment",
    invalid: "Pick two valid dates to calculate the difference.",
    direction: "direction",
  },
  zh: {
    command: "date --date='...'",
    start: "开始日期时间",
    end: "结束日期时间",
    setNow: "使用当前时间",
    clear: "清空",
    totalDays: "总天数",
    totalHours: "总小时数",
    totalMinutes: "总分钟数",
    totalSeconds: "总秒数",
    breakdown: "拆分结果",
    earlier: "更早",
    later: "更晚",
    same: "同一时刻",
    invalid: "请选择两个有效日期后再计算差值。",
    direction: "时间方向",
  },
} as const;

export default function DateDifferenceCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const [startInput, setStartInput] = useState("2026-01-01T09:00");
  const [endInput, setEndInput] = useState(toLocalInputValue(new Date()));
  const text = TEXT[locale];

  const result = useMemo(() => {
    const start = parseDateInput(startInput);
    const end = parseDateInput(endInput);
    if (start === null || end === null) {
      return { error: text.invalid };
    }

    const diffMs = end.getTime() - start.getTime();
    const absMs = Math.abs(diffMs);
    const totalSeconds = Math.floor(absMs / 1000);
    const totalMinutes = Math.floor(absMs / 60000);
    const totalHours = Math.floor(absMs / 3600000);
    const totalDays = absMs / 86400000;
    const days = Math.floor(absMs / 86400000);
    const hours = Math.floor((absMs % 86400000) / 3600000);
    const minutes = Math.floor((absMs % 3600000) / 60000);
    const seconds = Math.floor((absMs % 60000) / 1000);

    return {
      direction: diffMs === 0 ? text.same : diffMs > 0 ? text.later : text.earlier,
      totalDays: totalDays.toFixed(3),
      totalHours,
      totalMinutes,
      totalSeconds,
      breakdown: `${days}d ${hours}h ${minutes}m ${seconds}s`,
    };
  }, [endInput, startInput, text.earlier, text.invalid, text.later, text.same]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/date-difference-calculator</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="date-diff-start" className="block text-sm font-medium">
            {text.start}
          </label>
          <input
            id="date-diff-start"
            type="datetime-local"
            value={startInput}
            onChange={(event) => setStartInput(event.target.value)}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => setStartInput(toLocalInputValue(new Date()))}
              className="rounded border border-[var(--terminal-border)] px-2 py-1 hover:border-[var(--terminal-accent)]"
            >
              {text.setNow}
            </button>
            <button
              type="button"
              onClick={() => setStartInput("")}
              className="rounded border border-[var(--terminal-border)] px-2 py-1 hover:border-[var(--terminal-accent)]"
            >
              {text.clear}
            </button>
          </div>
        </div>

        <div className="space-y-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="date-diff-end" className="block text-sm font-medium">
            {text.end}
          </label>
          <input
            id="date-diff-end"
            type="datetime-local"
            value={endInput}
            onChange={(event) => setEndInput(event.target.value)}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => setEndInput(toLocalInputValue(new Date()))}
              className="rounded border border-[var(--terminal-border)] px-2 py-1 hover:border-[var(--terminal-accent)]"
            >
              {text.setNow}
            </button>
            <button
              type="button"
              onClick={() => setEndInput("")}
              className="rounded border border-[var(--terminal-border)] px-2 py-1 hover:border-[var(--terminal-accent)]"
            >
              {text.clear}
            </button>
          </div>
        </div>
      </div>

      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          {result.error}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.direction}</div>
            <div className="mt-1 text-sm">{result.direction}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.totalDays}</div>
            <div className="mt-1 font-mono text-sm">{result.totalDays}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.totalHours}</div>
            <div className="mt-1 font-mono text-sm">{result.totalHours}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.totalMinutes}</div>
            <div className="mt-1 font-mono text-sm">{result.totalMinutes}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.totalSeconds}</div>
            <div className="mt-1 font-mono text-sm">{result.totalSeconds}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.breakdown}</div>
            <div className="mt-1 font-mono text-sm">{result.breakdown}</div>
          </div>
        </div>
      )}
    </section>
  );
}
