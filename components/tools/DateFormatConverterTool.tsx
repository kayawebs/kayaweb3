"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function parseInput(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return { state: "empty" as const };
  const date = new Date(trimmed);
  if (!Number.isNaN(date.getTime())) return { state: "valid" as const, date };

  const plainDate = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (plainDate) {
    const [, y, m, d] = plainDate;
    return { state: "valid" as const, date: new Date(`${y}-${m}-${d}T00:00:00`) };
  }

  return { state: "invalid" as const };
}

function formatDMY(date: Date) {
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function formatMDY(date: Date) {
  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`;
}

function formatYMD(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const TEXT = {
  en: {
    command: "strftime",
    input: "Date input",
    placeholder: "2026-05-02T14:30:00Z",
    invalid: "Enter a valid date string or ISO timestamp.",
    iso: "ISO 8601",
    utc: "UTC",
    local: "Local",
    ymd: "YYYY-MM-DD",
    dmy: "DD/MM/YYYY",
    mdy: "MM/DD/YYYY",
    timestamp: "timestamp seconds",
  },
  zh: {
    command: "strftime",
    input: "日期输入",
    placeholder: "2026-05-02T14:30:00Z",
    invalid: "请输入有效的日期字符串或 ISO 时间。",
    iso: "ISO 8601",
    utc: "UTC",
    local: "本地时间",
    ymd: "YYYY-MM-DD",
    dmy: "DD/MM/YYYY",
    mdy: "MM/DD/YYYY",
    timestamp: "秒级时间戳",
  },
} as const;

export default function DateFormatConverterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState("2026-05-02T14:30:00Z");

  const result = useMemo(() => {
    const parsed = parseInput(input);
    if (parsed.state === "empty") return null;
    if (parsed.state === "invalid") return { error: text.invalid };
    const date = parsed.date;

    return {
      iso: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toLocaleString(locale === "zh" ? "zh-CN" : "en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZoneName: "short",
      }),
      ymd: formatYMD(date),
      dmy: formatDMY(date),
      mdy: formatMDY(date),
      timestamp: Math.floor(date.getTime() / 1000),
    };
  }, [input, locale, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/date-format-converter</span>
        <span>{text.command}</span>
      </div>

      <div className="space-y-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <label htmlFor="date-format-input" className="block text-sm font-medium">
          {text.input}
        </label>
        <input
          id="date-format-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={text.placeholder}
          className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]"
        />
      </div>

      {result?.error ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : result ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.iso}</div>
            <div className="mt-1 break-all font-mono text-xs sm:text-sm">{result.iso}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.utc}</div>
            <div className="mt-1 break-all text-sm">{result.utc}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.local}</div>
            <div className="mt-1 break-all text-sm">{result.local}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.timestamp}</div>
            <div className="mt-1 break-all font-mono text-sm">{result.timestamp}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.ymd}</div>
            <div className="mt-1 font-mono text-sm">{result.ymd}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.dmy}</div>
            <div className="mt-1 font-mono text-sm">{result.dmy}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-3">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.mdy}</div>
            <div className="mt-1 font-mono text-sm">{result.mdy}</div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
