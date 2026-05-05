"use client";

import { useEffect, useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function toLocalInputValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const TEXT = {
  en: {
    command: "sleep 1",
    targetDate: "Target date and time",
    useOneHour: "use +1 hour",
    useOneDay: "use +1 day",
    expired: "target time has passed",
    days: "days",
    hours: "hours",
    minutes: "minutes",
    seconds: "seconds",
    invalid: "Pick a valid target date and time.",
  },
  zh: {
    command: "sleep 1",
    targetDate: "目标日期时间",
    useOneHour: "使用 1 小时后",
    useOneDay: "使用 1 天后",
    expired: "目标时间已过去",
    days: "天",
    hours: "小时",
    minutes: "分钟",
    seconds: "秒",
    invalid: "请选择有效的目标日期时间。",
  },
} as const;

export default function CountdownTimerDateTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [targetDate, setTargetDate] = useState(toLocalInputValue(new Date(Date.now() + 3600000)));
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const result = useMemo(() => {
    const target = new Date(targetDate);
    if (Number.isNaN(target.getTime())) return { error: text.invalid };
    const diff = target.getTime() - now;
    if (diff <= 0) return { expired: true };

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
  }, [now, targetDate, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/countdown-timer-date</span>
        <span>{text.command}</span>
      </div>

      <div className="space-y-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <label htmlFor="countdown-target" className="block text-sm font-medium">
          {text.targetDate}
        </label>
        <input
          id="countdown-target"
          type="datetime-local"
          value={targetDate}
          onChange={(event) => setTargetDate(event.target.value)}
          className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]"
        />
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => setTargetDate(toLocalInputValue(new Date(Date.now() + 3600000)))}
            className="rounded border border-[var(--terminal-border)] px-2 py-1 hover:border-[var(--terminal-accent)]"
          >
            {text.useOneHour}
          </button>
          <button
            type="button"
            onClick={() => setTargetDate(toLocalInputValue(new Date(Date.now() + 86400000)))}
            className="rounded border border-[var(--terminal-border)] px-2 py-1 hover:border-[var(--terminal-accent)]"
          >
            {text.useOneDay}
          </button>
        </div>
      </div>

      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : "expired" in result ? (
        <p className="rounded border border-[var(--terminal-border)] bg-[var(--background)]/40 px-3 py-2 text-sm text-[var(--terminal-muted)]">{text.expired}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.days}</div><div className="mt-1 font-mono text-lg">{result.days}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.hours}</div><div className="mt-1 font-mono text-lg">{result.hours}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.minutes}</div><div className="mt-1 font-mono text-lg">{result.minutes}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.seconds}</div><div className="mt-1 font-mono text-lg">{result.seconds}</div></div>
        </div>
      )}
    </section>
  );
}
