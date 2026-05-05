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

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function toLocalInputValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

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

function getFormatter(timeZone: string, locale: ToolLocale) {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
  });
}

function getParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);

  const read = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour"),
    minute: read("minute"),
    second: read("second"),
  };
}

function zonedTimeToUtc(input: string, timeZone: string) {
  if (!input.trim()) return null;
  const match = input.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) return null;

  const [, yearRaw, monthRaw, dayRaw, hourRaw, minuteRaw] = match;
  const desired = {
    year: Number(yearRaw),
    month: Number(monthRaw),
    day: Number(dayRaw),
    hour: Number(hourRaw),
    minute: Number(minuteRaw),
    second: 0,
  };

  let utcMs = Date.UTC(desired.year, desired.month - 1, desired.day, desired.hour, desired.minute, 0);

  for (let i = 0; i < 3; i += 1) {
    const actual = getParts(new Date(utcMs), timeZone);
    const desiredUtc = Date.UTC(
      desired.year,
      desired.month - 1,
      desired.day,
      desired.hour,
      desired.minute,
      desired.second,
    );
    const actualUtc = Date.UTC(
      actual.year,
      actual.month - 1,
      actual.day,
      actual.hour,
      actual.minute,
      actual.second,
    );
    const diff = desiredUtc - actualUtc;
    if (diff === 0) break;
    utcMs += diff;
  }

  return new Date(utcMs);
}

const TEXT = {
  en: {
    command: "TZ=UTC date",
    sourceDate: "Source date and time",
    sourceZone: "From timezone",
    targetZone: "To timezone",
    useNow: "use now",
    result: "Converted time",
    iso: "ISO 8601",
    utc: "UTC",
    sourcePreview: "Source preview",
    targetPreview: "Target preview",
    invalid: "Enter a valid date and choose both timezones.",
  },
  zh: {
    command: "TZ=UTC date",
    sourceDate: "原始日期时间",
    sourceZone: "源时区",
    targetZone: "目标时区",
    useNow: "使用当前时间",
    result: "转换结果",
    iso: "ISO 8601",
    utc: "UTC",
    sourcePreview: "源时区预览",
    targetPreview: "目标时区预览",
    invalid: "请输入有效日期，并选择源时区和目标时区。",
  },
} as const;

export default function TimezoneConverterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const timezones = useMemo(() => getTimeZoneOptions(), []);
  const [dateInput, setDateInput] = useState("2026-05-02T14:30");
  const [sourceZone, setSourceZone] = useState("UTC");
  const [targetZone, setTargetZone] = useState(locale === "zh" ? "Asia/Shanghai" : "America/New_York");

  const result = useMemo(() => {
    if (!sourceZone || !targetZone) {
      return { error: text.invalid };
    }

    const utcDate = zonedTimeToUtc(dateInput, sourceZone);
    if (utcDate === null) {
      return { error: text.invalid };
    }

    return {
      iso: utcDate.toISOString(),
      utc: utcDate.toUTCString(),
      sourcePreview: getFormatter(sourceZone, locale).format(utcDate),
      targetPreview: getFormatter(targetZone, locale).format(utcDate),
    };
  }, [dateInput, locale, sourceZone, targetZone, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/timezone-converter</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="tz-date" className="block text-sm font-medium">
            {text.sourceDate}
          </label>
          <input
            id="tz-date"
            type="datetime-local"
            value={dateInput}
            onChange={(event) => setDateInput(event.target.value)}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
          <button
            type="button"
            onClick={() => setDateInput(toLocalInputValue(new Date()))}
            className="rounded border border-[var(--terminal-border)] px-2 py-1 text-xs font-mono hover:border-[var(--terminal-accent)]"
          >
            {text.useNow}
          </button>
        </div>

        <div className="space-y-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="tz-source" className="block text-sm font-medium">
            {text.sourceZone}
          </label>
          <select
            id="tz-source"
            value={sourceZone}
            onChange={(event) => setSourceZone(event.target.value)}
            className="w-full rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]"
          >
            {timezones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="tz-target" className="block text-sm font-medium">
            {text.targetZone}
          </label>
          <select
            id="tz-target"
            value={targetZone}
            onChange={(event) => setTargetZone(event.target.value)}
            className="w-full rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]"
          >
            {timezones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>
      </div>

      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          {result.error}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.sourcePreview}</div>
            <div className="mt-1 break-all text-sm">{result.sourcePreview}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.targetPreview}</div>
            <div className="mt-1 break-all text-sm">{result.targetPreview}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.utc}</div>
            <div className="mt-1 break-all text-sm">{result.utc}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.iso}</div>
            <div className="mt-1 break-all font-mono text-xs sm:text-sm">{result.iso}</div>
          </div>
        </div>
      )}
    </section>
  );
}
