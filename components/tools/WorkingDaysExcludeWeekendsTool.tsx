"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addWorkingDays(start: Date, workingDays: number) {
  const current = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  let added = 0;

  while (added < workingDays) {
    current.setDate(current.getDate() + 1);
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      added += 1;
    }
  }

  return current;
}

const TEXT = {
  en: {
    command: "date -v+Mon-Fri",
    startDate: "Start date",
    workingDays: "Working days to add",
    resultDate: "Result date",
    weekday: "weekday",
    invalid: "Pick a valid date and enter a non-negative working day count.",
  },
  zh: {
    command: "date -v+Mon-Fri",
    startDate: "开始日期",
    workingDays: "要增加的工作日数量",
    resultDate: "结果日期",
    weekday: "星期",
    invalid: "请选择有效日期，并输入不小于 0 的工作日数量。",
  },
} as const;

export default function WorkingDaysExcludeWeekendsTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [startDate, setStartDate] = useState("2026-05-04");
  const [workingDays, setWorkingDays] = useState("10");

  const result = useMemo(() => {
    const start = new Date(`${startDate}T00:00:00`);
    const count = Number(workingDays);
    if (Number.isNaN(start.getTime()) || !Number.isInteger(count) || count < 0) {
      return { error: text.invalid };
    }

    const end = addWorkingDays(start, count);
    const weekday = end.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", { weekday: "long" });

    return {
      resultDate: formatDateInput(end),
      weekday,
    };
  }, [locale, startDate, text.invalid, workingDays]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/working-days-exclude-weekends</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="working-days-start" className="block text-sm font-medium">
            {text.startDate}
          </label>
          <input
            id="working-days-start"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="working-days-count" className="block text-sm font-medium">
            {text.workingDays}
          </label>
          <input
            id="working-days-count"
            value={workingDays}
            onChange={(event) => setWorkingDays(event.target.value)}
            inputMode="numeric"
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
        </div>
      </div>

      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.resultDate}</div>
            <div className="mt-1 font-mono text-lg">{result.resultDate}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.weekday}</div>
            <div className="mt-1 text-sm">{result.weekday}</div>
          </div>
        </div>
      )}
    </section>
  );
}
