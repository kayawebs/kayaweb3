"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

function parseDateString(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return { state: "empty" as const };
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return { state: "invalid" as const };
  return { state: "valid" as const, date };
}

const TEXT = {
  en: {
    command: "date -j -f",
    input: "Date string input",
    placeholder: "May 2, 2026 14:30 UTC",
    invalid: "Enter a date string that JavaScript can parse reliably.",
    iso: "ISO 8601",
    utc: "UTC",
    local: "Local",
    timestamp: "timestamp ms",
  },
  zh: {
    command: "date -j -f",
    input: "日期字符串输入",
    placeholder: "May 2, 2026 14:30 UTC",
    invalid: "请输入 JavaScript 能稳定解析的日期字符串。",
    iso: "ISO 8601",
    utc: "UTC",
    local: "本地时间",
    timestamp: "毫秒时间戳",
  },
} as const;

export default function DateStringParserTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState("May 2, 2026 14:30 UTC");

  const result = useMemo(() => {
    const parsed = parseDateString(input);
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
      timestamp: date.getTime(),
    };
  }, [input, locale, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/date-string-parser</span>
        <span>{text.command}</span>
      </div>

      <div className="space-y-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <label htmlFor="date-string-input" className="block text-sm font-medium">{text.input}</label>
        <input id="date-string-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={text.placeholder} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]" />
      </div>

      {result?.error ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : result ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.iso}</div><div className="mt-1 break-all font-mono text-xs sm:text-sm">{result.iso}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.utc}</div><div className="mt-1 text-sm">{result.utc}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.local}</div><div className="mt-1 text-sm">{result.local}</div></div>
          <div className="rounded border border-[var(--terminal-border)] p-3"><div className="text-xs font-mono text-[var(--terminal-muted)]">{text.timestamp}</div><div className="mt-1 break-all font-mono text-sm">{result.timestamp}</div></div>
        </div>
      ) : null}
    </section>
  );
}
