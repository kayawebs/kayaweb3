"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

function countBusinessDays(start: Date, end: Date, includeStart: boolean) {
  const from = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const to = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  if (from > to) return null;

  const current = new Date(from);
  let businessDays = 0;
  let weekendDays = 0;

  while (current <= to) {
    const day = current.getDay();
    const isWeekend = day === 0 || day === 6;
    const isSameAsStart = current.getTime() === from.getTime();

    if (!(isSameAsStart && !includeStart)) {
      if (isWeekend) weekendDays += 1;
      else businessDays += 1;
    }

    current.setDate(current.getDate() + 1);
  }

  return { businessDays, weekendDays };
}

const TEXT = {
  en: {
    command: "date -v+Mon-Fri",
    startDate: "Start date",
    endDate: "End date",
    includeStart: "include start date in the count",
    invalid: "Pick a valid date range where end date is not earlier than start date.",
    businessDays: "business days",
    weekendDays: "weekend days",
    totalDays: "total days",
  },
  zh: {
    command: "date -v+Mon-Fri",
    startDate: "开始日期",
    endDate: "结束日期",
    includeStart: "统计时包含开始日期",
    invalid: "请选择有效日期范围，且结束日期不能早于开始日期。",
    businessDays: "工作日",
    weekendDays: "周末天数",
    totalDays: "总天数",
  },
} as const;

export default function BusinessDaysCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-15");
  const [includeStart, setIncludeStart] = useState(true);

  const result = useMemo(() => {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return { error: text.invalid };

    const counted = countBusinessDays(start, end, includeStart);
    if (!counted) return { error: text.invalid };

    const totalDays = Math.floor((end.getTime() - start.getTime()) / 86400000) + (includeStart ? 1 : 0);

    return {
      businessDays: counted.businessDays,
      weekendDays: counted.weekendDays,
      totalDays: Math.max(totalDays, 0),
    };
  }, [endDate, includeStart, startDate, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/business-days-calculator</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="business-start-date" className="block text-sm font-medium">
            {text.startDate}
          </label>
          <input id="business-start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="business-end-date" className="block text-sm font-medium">
            {text.endDate}
          </label>
          <input id="business-end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-[var(--foreground)]/85">
        <input type="checkbox" checked={includeStart} onChange={(e) => setIncludeStart(e.target.checked)} className="h-4 w-4 accent-[var(--terminal-accent)]" />
        {text.includeStart}
      </label>

      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.businessDays}</div>
            <div className="mt-1 font-mono text-lg">{result.businessDays}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.weekendDays}</div>
            <div className="mt-1 font-mono text-lg">{result.weekendDays}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.totalDays}</div>
            <div className="mt-1 font-mono text-lg">{result.totalDays}</div>
          </div>
        </div>
      )}
    </section>
  );
}
