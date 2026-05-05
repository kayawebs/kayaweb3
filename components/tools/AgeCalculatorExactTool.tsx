"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function toDateInput(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function calculateAge(birthDate: Date, targetDate: Date) {
  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  let days = targetDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = (targetDate.getMonth() + 11) % 12;
    const prevMonthYear = prevMonth === 11 ? targetDate.getFullYear() - 1 : targetDate.getFullYear();
    days += daysInMonth(prevMonthYear, prevMonth);
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

const TEXT = {
  en: {
    command: "date -j -f",
    birthDate: "Birth date",
    targetDate: "Age on date",
    useToday: "use today",
    invalid: "Pick a valid birth date and target date.",
    exactAge: "exact age",
    totalDays: "total days",
    totalMonths: "approx total months",
  },
  zh: {
    command: "date -j -f",
    birthDate: "出生日期",
    targetDate: "计算到日期",
    useToday: "使用今天",
    invalid: "请选择有效的出生日期和目标日期。",
    exactAge: "精确年龄",
    totalDays: "总天数",
    totalMonths: "约总月数",
  },
} as const;

export default function AgeCalculatorExactTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [birthDate, setBirthDate] = useState("1990-01-01");
  const [targetDate, setTargetDate] = useState(toDateInput(new Date()));

  const result = useMemo(() => {
    const birth = new Date(`${birthDate}T00:00:00`);
    const target = new Date(`${targetDate}T00:00:00`);
    if (Number.isNaN(birth.getTime()) || Number.isNaN(target.getTime()) || target < birth) {
      return { error: text.invalid };
    }

    const exact = calculateAge(birth, target);
    const totalDays = Math.floor((target.getTime() - birth.getTime()) / 86400000);
    const totalMonths = (exact.years * 12 + exact.months + exact.days / 30.4375).toFixed(2);

    return { exact, totalDays, totalMonths };
  }, [birthDate, targetDate, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/age-calculator-exact</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="age-birth-date" className="block text-sm font-medium">
            {text.birthDate}
          </label>
          <input id="age-birth-date" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="age-target-date" className="block text-sm font-medium">
            {text.targetDate}
          </label>
          <input id="age-target-date" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]" />
          <button type="button" onClick={() => setTargetDate(toDateInput(new Date()))} className="rounded border border-[var(--terminal-border)] px-2 py-1 text-xs font-mono hover:border-[var(--terminal-accent)]">
            {text.useToday}
          </button>
        </div>
      </div>

      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.exactAge}</div>
            <div className="mt-1 font-mono text-sm">
              {result.exact.years}y {result.exact.months}m {result.exact.days}d
            </div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.totalDays}</div>
            <div className="mt-1 font-mono text-sm">{result.totalDays}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.totalMonths}</div>
            <div className="mt-1 font-mono text-sm">{result.totalMonths}</div>
          </div>
        </div>
      )}
    </section>
  );
}
