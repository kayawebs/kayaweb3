"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const FALLBACK_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
];

function getTimeZoneOptions() {
  if (typeof Intl.supportedValuesOf === "function") {
    try {
      return Intl.supportedValuesOf("timeZone");
    } catch {
      return FALLBACK_TIMEZONES;
    }
  }
  return FALLBACK_TIMEZONES;
}

function getOffsetLabel(date: Date, timeZone: string, locale: ToolLocale) {
  const parts = new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    timeZone,
    timeZoneName: "shortOffset",
    hour: "2-digit",
  }).formatToParts(date);
  return parts.find((part) => part.type === "timeZoneName")?.value ?? "UTC";
}

const TEXT = {
  en: {
    command: "date +%Z",
    timezoneA: "Timezone A",
    timezoneB: "Timezone B",
    offsetA: "offset A",
    offsetB: "offset B",
    difference: "offset difference",
    currentA: "current time A",
    currentB: "current time B",
  },
  zh: {
    command: "date +%Z",
    timezoneA: "时区 A",
    timezoneB: "时区 B",
    offsetA: "A 偏移",
    offsetB: "B 偏移",
    difference: "偏移差值",
    currentA: "A 当前时间",
    currentB: "B 当前时间",
  },
} as const;

export default function TimezoneDifferenceCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const timezones = useMemo(() => getTimeZoneOptions(), []);
  const [timezoneA, setTimezoneA] = useState("UTC");
  const [timezoneB, setTimezoneB] = useState(locale === "zh" ? "Asia/Shanghai" : "America/New_York");

  const result = useMemo(() => {
    const now = new Date();
    const currentA = now.toLocaleString(locale === "zh" ? "zh-CN" : "en-US", {
      timeZone: timezoneA,
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "short",
    });
    const currentB = now.toLocaleString(locale === "zh" ? "zh-CN" : "en-US", {
      timeZone: timezoneB,
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "short",
    });

    return {
      offsetA: getOffsetLabel(now, timezoneA, locale),
      offsetB: getOffsetLabel(now, timezoneB, locale),
      difference: `${timezoneA} ↔ ${timezoneB}`,
      currentA,
      currentB,
    };
  }, [locale, timezoneA, timezoneB]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/timezone-difference-calculator</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="timezone-diff-a" className="block text-sm font-medium">{text.timezoneA}</label>
          <select id="timezone-diff-a" value={timezoneA} onChange={(e) => setTimezoneA(e.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]">
            {timezones.map((zone) => <option key={zone} value={zone}>{zone}</option>)}
          </select>
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="timezone-diff-b" className="block text-sm font-medium">{text.timezoneB}</label>
          <select id="timezone-diff-b" value={timezoneB} onChange={(e) => setTimezoneB(e.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]">
            {timezones.map((zone) => <option key={zone} value={zone}>{zone}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.offsetA}</div><div className="mt-1 text-sm">{result.offsetA}</div></div>
        <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.offsetB}</div><div className="mt-1 text-sm">{result.offsetB}</div></div>
        <div className="rounded border border-[var(--terminal-border)] p-3 sm:col-span-2"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.difference}</div><div className="mt-1 font-mono text-sm">{result.difference}</div></div>
        <div className="rounded border border-[var(--terminal-border)] p-3 sm:col-span-2"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.currentA}</div><div className="mt-1 text-sm">{result.currentA}</div></div>
        <div className="rounded border border-[var(--terminal-border)] p-3 sm:col-span-2"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.currentB}</div><div className="mt-1 text-sm">{result.currentB}</div></div>
      </div>
    </section>
  );
}
