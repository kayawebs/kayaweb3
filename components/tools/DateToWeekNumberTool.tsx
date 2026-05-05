"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

function getIsoWeek(date: Date) {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil((((target.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return { weekNum, weekYear: target.getUTCFullYear() };
}

const TEXT = {
  en: {
    command: "date +%V",
    date: "Date",
    invalid: "Pick a valid date.",
    weekNumber: "ISO week number",
    weekYear: "ISO week year",
    weekday: "weekday",
  },
  zh: {
    command: "date +%V",
    date: "日期",
    invalid: "请选择有效日期。",
    weekNumber: "ISO 周数",
    weekYear: "ISO 周所属年份",
    weekday: "星期",
  },
} as const;

export default function DateToWeekNumberTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState("2026-05-02");

  const result = useMemo(() => {
    const date = new Date(`${input}T00:00:00`);
    if (Number.isNaN(date.getTime())) return { error: text.invalid };
    const { weekNum, weekYear } = getIsoWeek(date);
    const weekday = date.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", { weekday: "long" });
    return { weekNum, weekYear, weekday };
  }, [input, locale, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/date-to-week-number</span>
        <span>{text.command}</span>
      </div>

      <div className="space-y-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <label htmlFor="week-number-input" className="block text-sm font-medium">{text.date}</label>
        <input id="week-number-input" type="date" value={input} onChange={(e) => setInput(e.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]" />
      </div>

      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.weekNumber}</div><div className="mt-1 font-mono text-lg">{result.weekNum}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.weekYear}</div><div className="mt-1 font-mono text-lg">{result.weekYear}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.weekday}</div><div className="mt-1 text-sm">{result.weekday}</div></div>
        </div>
      )}
    </section>
  );
}
