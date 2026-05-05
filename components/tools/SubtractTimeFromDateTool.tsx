"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function toLocalInputValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatLocal(date: Date, locale: ToolLocale) {
  return date.toLocaleString(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
  });
}

const TEXT = {
  en: {
    command: "date -v-1d",
    baseDate: "Base date and time",
    days: "days",
    hours: "hours",
    minutes: "minutes",
    useNow: "use now",
    invalid: "Pick a valid base date.",
    iso: "ISO 8601",
    utc: "UTC",
    local: "Local",
    timestamp: "timestamp ms",
  },
  zh: {
    command: "date -v-1d",
    baseDate: "基础日期时间",
    days: "天",
    hours: "小时",
    minutes: "分钟",
    useNow: "使用当前时间",
    invalid: "请选择有效的基础日期。",
    iso: "ISO 8601",
    utc: "UTC",
    local: "本地时间",
    timestamp: "毫秒时间戳",
  },
} as const;

export default function SubtractTimeFromDateTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [baseDate, setBaseDate] = useState("2026-05-02T12:00");
  const [days, setDays] = useState("1");
  const [hours, setHours] = useState("2");
  const [minutes, setMinutes] = useState("30");

  const result = useMemo(() => {
    const date = new Date(baseDate);
    if (Number.isNaN(date.getTime())) return { error: text.invalid };

    const daysNum = Number(days || 0);
    const hoursNum = Number(hours || 0);
    const minutesNum = Number(minutes || 0);
    if (![daysNum, hoursNum, minutesNum].every(Number.isFinite)) return { error: text.invalid };

    const deltaMs = daysNum * 86400000 + hoursNum * 3600000 + minutesNum * 60000;
    const resultDate = new Date(date.getTime() - deltaMs);

    return {
      iso: resultDate.toISOString(),
      utc: resultDate.toUTCString(),
      local: formatLocal(resultDate, locale),
      timestamp: resultDate.getTime(),
    };
  }, [baseDate, days, hours, locale, minutes, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/subtract-time-from-date</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="subtract-time-date" className="block text-sm font-medium">
            {text.baseDate}
          </label>
          <input
            id="subtract-time-date"
            type="datetime-local"
            value={baseDate}
            onChange={(event) => setBaseDate(event.target.value)}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
          <button
            type="button"
            onClick={() => setBaseDate(toLocalInputValue(new Date()))}
            className="rounded border border-[var(--terminal-border)] px-2 py-1 text-xs font-mono hover:border-[var(--terminal-accent)]"
          >
            {text.useNow}
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm">
            <span className="block font-medium">{text.days}</span>
            <input value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" inputMode="decimal" />
          </label>
          <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm">
            <span className="block font-medium">{text.hours}</span>
            <input value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" inputMode="decimal" />
          </label>
          <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm">
            <span className="block font-medium">{text.minutes}</span>
            <input value={minutes} onChange={(e) => setMinutes(e.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" inputMode="decimal" />
          </label>
        </div>
      </div>

      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.local}</div>
            <div className="mt-1 text-sm">{result.local}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.utc}</div>
            <div className="mt-1 text-sm">{result.utc}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.iso}</div>
            <div className="mt-1 break-all font-mono text-xs sm:text-sm">{result.iso}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.timestamp}</div>
            <div className="mt-1 break-all font-mono text-sm">{result.timestamp}</div>
          </div>
        </div>
      )}
    </section>
  );
}
