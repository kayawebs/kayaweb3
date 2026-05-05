"use client";

import { useEffect, useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const MAX_JS_DATE_MS = 8.64e15;

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

function parseTimestampInput(value: string, locale: ToolLocale) {
  const cleaned = value.trim();
  if (!cleaned) {
    return { error: locale === "zh" ? "请输入 Unix 时间戳，支持秒或毫秒。" : "Enter a Unix timestamp in seconds or milliseconds." };
  }

  if (!/^-?\d+$/.test(cleaned)) {
    return { error: locale === "zh" ? "当前只支持整数时间戳。" : "Only whole-number timestamps are supported." };
  }

  const numeric = Number(cleaned);
  if (!Number.isFinite(numeric)) {
    return { error: locale === "zh" ? "时间戳数值过大，无法安全解析。" : "Timestamp is too large to parse safely." };
  }

  const isMilliseconds = Math.abs(numeric) >= 1e12;
  const unit = isMilliseconds ? (locale === "zh" ? "毫秒" : "milliseconds") : (locale === "zh" ? "秒" : "seconds");
  const normalizedMilliseconds = isMilliseconds ? numeric : numeric * 1000;

  if (Math.abs(normalizedMilliseconds) > MAX_JS_DATE_MS) {
    return { error: locale === "zh" ? "时间戳超出 JavaScript Date 可处理范围。" : "Timestamp is outside the JavaScript Date range." };
  }

  const date = new Date(normalizedMilliseconds);
  if (Number.isNaN(date.getTime())) {
    return { error: locale === "zh" ? "时间戳无法转换为有效日期。" : "Timestamp could not be converted into a valid date." };
  }

  return {
    unit,
    milliseconds: normalizedMilliseconds,
    seconds: Math.trunc(normalizedMilliseconds / 1000),
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: formatLocal(date, locale),
    datetimeLocal: toLocalInputValue(date),
  };
}

function parseDateInput(value: string, locale: ToolLocale) {
  const cleaned = value.trim();
  if (!cleaned) {
    return { error: locale === "zh" ? "请选择一个日期和时间进行转换。" : "Pick a date and time to convert." };
  }

  const date = new Date(cleaned);
  if (Number.isNaN(date.getTime())) {
    return { error: locale === "zh" ? "日期输入无效，请尝试使用选择器或 ISO 格式。" : "Date input is invalid. Try ISO format or the picker." };
  }

  const milliseconds = date.getTime();
  return {
    milliseconds,
    seconds: Math.trunc(milliseconds / 1000),
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: formatLocal(date, locale),
  };
}

const TEXT = {
  en: {
    command: "node convert.js",
    timestampLabel: "Unix timestamp",
    timestampPlaceholder: "1714651200 or 1714651200000",
    currentSeconds: "use current seconds",
    currentMs: "use current ms",
    clear: "clear",
    detectedUnit: "detected unit",
    utc: "UTC",
    local: "Local",
    iso: "ISO 8601",
    dateLabel: "Date to timestamp",
    useNow: "use now",
    seconds: "seconds",
    milliseconds: "milliseconds",
    currentTimestamp: "Current timestamp",
    live: "live",
  },
  zh: {
    command: "node convert.js",
    timestampLabel: "Unix 时间戳",
    timestampPlaceholder: "1714651200 或 1714651200000",
    currentSeconds: "使用当前秒级时间戳",
    currentMs: "使用当前毫秒时间戳",
    clear: "清空",
    detectedUnit: "识别单位",
    utc: "UTC",
    local: "本地时间",
    iso: "ISO 8601",
    dateLabel: "日期转时间戳",
    useNow: "使用当前时间",
    seconds: "秒",
    milliseconds: "毫秒",
    currentTimestamp: "当前时间戳",
    live: "实时",
  },
} as const;

export default function TimestampConverter({ locale = "en" }: { locale?: ToolLocale }) {
  const [timestampInput, setTimestampInput] = useState("1714651200");
  const [dateInput, setDateInput] = useState("");
  const [nowMs, setNowMs] = useState<number | null>(null);
  const text = TEXT[locale];

  useEffect(() => {
    const syncNow = () => setNowMs(Date.now());
    syncNow();
    const timer = window.setInterval(syncNow, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const timestampResult = useMemo(() => parseTimestampInput(timestampInput, locale), [timestampInput, locale]);
  const dateResult = useMemo(() => parseDateInput(dateInput, locale), [dateInput, locale]);

  const liveNow = useMemo(() => {
    if (nowMs === null) return null;
    const current = new Date(nowMs);
    return {
      seconds: Math.floor(nowMs / 1000),
      milliseconds: nowMs,
      iso: current.toISOString(),
      local: formatLocal(current, locale),
    };
  }, [locale, nowMs]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/timestamp-converter</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="space-y-2">
            <label htmlFor="timestamp-input" className="block text-sm font-medium">
              {text.timestampLabel}
            </label>
            <input
              id="timestamp-input"
              value={timestampInput}
              onChange={(event) => setTimestampInput(event.target.value)}
              className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]"
              inputMode="numeric"
              placeholder={text.timestampPlaceholder}
            />
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setTimestampInput(String(Math.floor(Date.now() / 1000)))}
                className="rounded border border-[var(--terminal-border)] px-2 py-1 hover:border-[var(--terminal-accent)]"
              >
                {text.currentSeconds}
              </button>
              <button
                type="button"
                onClick={() => setTimestampInput(String(Date.now()))}
                className="rounded border border-[var(--terminal-border)] px-2 py-1 hover:border-[var(--terminal-accent)]"
              >
                {text.currentMs}
              </button>
              <button
                type="button"
                onClick={() => setTimestampInput("")}
                className="rounded border border-[var(--terminal-border)] px-2 py-1 hover:border-[var(--terminal-accent)]"
              >
                {text.clear}
              </button>
            </div>
          </div>

          {"error" in timestampResult ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
              {timestampResult.error}
            </p>
          ) : (
            <dl className="grid gap-3 text-sm">
              <div className="rounded border border-[var(--terminal-border)] p-3">
                <dt className="text-xs font-mono text-[var(--terminal-muted)]">{text.detectedUnit}</dt>
                <dd className="mt-1">{timestampResult.unit}</dd>
              </div>
              <div className="rounded border border-[var(--terminal-border)] p-3">
                <dt className="text-xs font-mono text-[var(--terminal-muted)]">{text.utc}</dt>
                <dd className="mt-1 break-all">{timestampResult.utc}</dd>
              </div>
              <div className="rounded border border-[var(--terminal-border)] p-3">
                <dt className="text-xs font-mono text-[var(--terminal-muted)]">{text.local}</dt>
                <dd className="mt-1 break-all">{timestampResult.local}</dd>
              </div>
              <div className="rounded border border-[var(--terminal-border)] p-3">
                <dt className="text-xs font-mono text-[var(--terminal-muted)]">{text.iso}</dt>
                <dd className="mt-1 break-all font-mono text-xs sm:text-sm">{timestampResult.iso}</dd>
              </div>
            </dl>
          )}
        </div>

        <div className="space-y-4 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="space-y-2">
            <label htmlFor="date-input" className="block text-sm font-medium">
              {text.dateLabel}
            </label>
            <input
              id="date-input"
              type="datetime-local"
              value={dateInput}
              onChange={(event) => setDateInput(event.target.value)}
              className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]"
            />
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setDateInput(toLocalInputValue(new Date()))}
                className="rounded border border-[var(--terminal-border)] px-2 py-1 hover:border-[var(--terminal-accent)]"
              >
                {text.useNow}
              </button>
              <button
                type="button"
                onClick={() => setDateInput("")}
                className="rounded border border-[var(--terminal-border)] px-2 py-1 hover:border-[var(--terminal-accent)]"
              >
                {text.clear}
              </button>
            </div>
          </div>

          {"error" in dateResult ? (
            <p className="rounded border border-[var(--terminal-border)] bg-[var(--background)]/50 px-3 py-2 text-sm text-[var(--terminal-muted)]">
              {dateResult.error}
            </p>
          ) : (
            <dl className="grid gap-3 text-sm">
              <div className="rounded border border-[var(--terminal-border)] p-3">
                <dt className="text-xs font-mono text-[var(--terminal-muted)]">{text.seconds}</dt>
                <dd className="mt-1 break-all font-mono">{dateResult.seconds}</dd>
              </div>
              <div className="rounded border border-[var(--terminal-border)] p-3">
                <dt className="text-xs font-mono text-[var(--terminal-muted)]">{text.milliseconds}</dt>
                <dd className="mt-1 break-all font-mono">{dateResult.milliseconds}</dd>
              </div>
              <div className="rounded border border-[var(--terminal-border)] p-3">
                <dt className="text-xs font-mono text-[var(--terminal-muted)]">{text.utc}</dt>
                <dd className="mt-1 break-all">{dateResult.utc}</dd>
              </div>
              <div className="rounded border border-[var(--terminal-border)] p-3">
                <dt className="text-xs font-mono text-[var(--terminal-muted)]">{text.iso}</dt>
                <dd className="mt-1 break-all font-mono text-xs sm:text-sm">{dateResult.iso}</dd>
              </div>
            </dl>
          )}
        </div>
      </div>

      {liveNow && (
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--background)]/40 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">{text.currentTimestamp}</h2>
            <span className="text-xs font-mono text-[var(--terminal-muted)]">{text.live}</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.seconds}</div>
              <div className="mt-1 break-all font-mono text-sm">{liveNow.seconds}</div>
            </div>
            <div>
              <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.milliseconds}</div>
              <div className="mt-1 break-all font-mono text-sm">{liveNow.milliseconds}</div>
            </div>
            <div>
              <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.local}</div>
              <div className="mt-1 text-sm">{liveNow.local}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
