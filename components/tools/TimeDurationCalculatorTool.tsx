"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "expr 1 '*' 3600",
    days: "days",
    hours: "hours",
    minutes: "minutes",
    seconds: "seconds",
    totalSeconds: "total seconds",
    totalMinutes: "total minutes",
    totalHours: "total hours",
    totalMilliseconds: "total milliseconds",
    invalid: "Enter numeric duration values.",
  },
  zh: {
    command: "expr 1 '*' 3600",
    days: "天",
    hours: "小时",
    minutes: "分钟",
    seconds: "秒",
    totalSeconds: "总秒数",
    totalMinutes: "总分钟数",
    totalHours: "总小时数",
    totalMilliseconds: "总毫秒数",
    invalid: "请输入数值类型的时长。",
  },
} as const;

export default function TimeDurationCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [days, setDays] = useState("1");
  const [hours, setHours] = useState("2");
  const [minutes, setMinutes] = useState("30");
  const [seconds, setSeconds] = useState("15");

  const result = useMemo(() => {
    const values = [Number(days || 0), Number(hours || 0), Number(minutes || 0), Number(seconds || 0)];
    if (!values.every(Number.isFinite)) return { error: text.invalid };
    const [d, h, m, s] = values;
    const totalSeconds = d * 86400 + h * 3600 + m * 60 + s;
    return {
      totalSeconds,
      totalMinutes: totalSeconds / 60,
      totalHours: totalSeconds / 3600,
      totalMilliseconds: totalSeconds * 1000,
    };
  }, [days, hours, minutes, seconds, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/time-duration-calculator</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.days}</span><input value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" inputMode="decimal" /></label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.hours}</span><input value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" inputMode="decimal" /></label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.minutes}</span><input value={minutes} onChange={(e) => setMinutes(e.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" inputMode="decimal" /></label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm"><span className="block font-medium">{text.seconds}</span><input value={seconds} onChange={(e) => setSeconds(e.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" inputMode="decimal" /></label>
      </div>

      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.totalSeconds}</div><div className="mt-1 font-mono text-sm">{result.totalSeconds}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.totalMinutes}</div><div className="mt-1 font-mono text-sm">{result.totalMinutes}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.totalHours}</div><div className="mt-1 font-mono text-sm">{result.totalHours}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.totalMilliseconds}</div><div className="mt-1 font-mono text-sm">{result.totalMilliseconds}</div></div>
        </div>
      )}
    </section>
  );
}
