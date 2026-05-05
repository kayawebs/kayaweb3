"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

function parseTime(value: string) {
  const match = value.trim().match(/^(\d{2}):(\d{2})$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

const TEXT = {
  en: {
    command: "expr $end - $start",
    start: "Start time",
    end: "End time",
    allowNextDay: "treat end time as next day if earlier",
    invalid: "Enter valid start and end times.",
    totalHours: "total hours",
    totalMinutes: "total minutes",
    breakdown: "breakdown",
    direction: "direction",
    earlier: "end is earlier",
    later: "end is later",
    same: "same time",
  },
  zh: {
    command: "expr $end - $start",
    start: "开始时间",
    end: "结束时间",
    allowNextDay: "若结束时间更早，则按次日处理",
    invalid: "请输入有效的开始时间和结束时间。",
    totalHours: "总小时数",
    totalMinutes: "总分钟数",
    breakdown: "拆分结果",
    direction: "时间方向",
    earlier: "结束时间更早",
    later: "结束时间更晚",
    same: "相同时间",
  },
} as const;

export default function TimeDifferenceCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:30");
  const [nextDay, setNextDay] = useState(true);
  const text = TEXT[locale];

  const result = useMemo(() => {
    const start = parseTime(startTime);
    const end = parseTime(endTime);
    if (start === null || end === null) return { error: text.invalid };

    let diff = end - start;
    let direction: string = diff === 0 ? text.same : diff > 0 ? text.later : text.earlier;

    if (diff < 0 && nextDay) {
      diff += 24 * 60;
      direction = locale === "zh" ? "跨天计算" : "crosses midnight";
    }

    const absMinutes = Math.abs(diff);
    const hours = Math.floor(absMinutes / 60);
    const minutes = absMinutes % 60;

    return {
      direction,
      totalHours: (absMinutes / 60).toFixed(2),
      totalMinutes: absMinutes,
      breakdown: `${hours}h ${minutes}m`,
    };
  }, [endTime, locale, nextDay, startTime, text.earlier, text.invalid, text.later, text.same]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/time-difference-calculator</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="time-diff-start" className="block text-sm font-medium">
            {text.start}
          </label>
          <input
            id="time-diff-start"
            type="time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="time-diff-end" className="block text-sm font-medium">
            {text.end}
          </label>
          <input
            id="time-diff-end"
            type="time"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-[var(--foreground)]/85">
        <input
          type="checkbox"
          checked={nextDay}
          onChange={(event) => setNextDay(event.target.checked)}
          className="h-4 w-4 accent-[var(--terminal-accent)]"
        />
        {text.allowNextDay}
      </label>

      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          {result.error}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.direction}</div>
            <div className="mt-1 text-sm">{result.direction}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.totalHours}</div>
            <div className="mt-1 font-mono">{result.totalHours}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.totalMinutes}</div>
            <div className="mt-1 font-mono">{result.totalMinutes}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.breakdown}</div>
            <div className="mt-1 font-mono">{result.breakdown}</div>
          </div>
        </div>
      )}
    </section>
  );
}
