"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const LOCKTIME_TIMESTAMP_THRESHOLD = 500000000;

const TEXT = {
  en: {
    command: "nLockTime",
    mode: "Mode",
    raw: "Raw locktime",
    date: "Date / time (UTC)",
    kind: "Detected kind",
    normalized: "Normalized locktime",
    dateOutput: "UTC date",
    invalidRaw: "Raw locktime must be a non-negative integer.",
    invalidDate: "Enter a valid UTC date and time.",
    rawMode: "Decode raw locktime",
    dateMode: "Encode UTC date",
    blockHeight: "Block height",
    timestamp: "Unix timestamp",
  },
  zh: {
    command: "nLockTime",
    mode: "模式",
    raw: "原始 locktime",
    date: "日期时间（UTC）",
    kind: "识别类型",
    normalized: "标准 locktime",
    dateOutput: "UTC 时间",
    invalidRaw: "原始 locktime 必须是非负整数。",
    invalidDate: "请输入合法的 UTC 日期时间。",
    rawMode: "解码原始 locktime",
    dateMode: "编码 UTC 时间",
    blockHeight: "区块高度",
    timestamp: "Unix 时间戳",
  },
} as const;

function toDateTimeLocalValue(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default function BtcLocktimeCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [mode, setMode] = useState<"raw" | "date">("raw");
  const [rawValue, setRawValue] = useState<string>("840000");
  const [dateValue, setDateValue] = useState<string>(toDateTimeLocalValue(new Date("2026-01-01T00:00:00Z")));

  const result = useMemo(() => {
    if (mode === "raw") {
      if (!/^\d+$/.test(rawValue)) {
        return { error: text.invalidRaw };
      }

      const numeric = Number.parseInt(rawValue, 10);
      const kind = numeric < LOCKTIME_TIMESTAMP_THRESHOLD ? text.blockHeight : text.timestamp;
      return {
        kind,
        normalized: numeric.toString(),
        date: numeric < LOCKTIME_TIMESTAMP_THRESHOLD ? "" : new Date(numeric * 1000).toUTCString(),
      };
    }

    const millis = Date.parse(dateValue);
    if (!Number.isFinite(millis)) {
      return { error: text.invalidDate };
    }

    const seconds = Math.floor(millis / 1000);
    return {
      kind: text.timestamp,
      normalized: seconds.toString(),
      date: new Date(seconds * 1000).toUTCString(),
    };
  }, [dateValue, mode, rawValue, text.blockHeight, text.invalidDate, text.invalidRaw, text.timestamp]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/btc-locktime-calculator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="btc-locktime-mode" className="block text-sm font-medium">{text.mode}</label>
          <select id="btc-locktime-mode" value={mode} onChange={(event) => setMode(event.target.value as "raw" | "date")} className="w-full rounded border border-[var(--terminal-border)] bg-[var(--background)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]">
            <option value="raw">{text.rawMode}</option>
            <option value="date">{text.dateMode}</option>
          </select>
        </div>
        {mode === "raw" ? (
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 lg:col-span-2">
            <label htmlFor="btc-locktime-raw" className="block text-sm font-medium">{text.raw}</label>
            <input id="btc-locktime-raw" type="text" value={rawValue} onChange={(event) => setRawValue(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
          </div>
        ) : (
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 lg:col-span-2">
            <label htmlFor="btc-locktime-date" className="block text-sm font-medium">{text.date}</label>
            <input id="btc-locktime-date" type="datetime-local" value={dateValue} onChange={(event) => setDateValue(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
          </div>
        )}
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.kind}</div>
            <textarea readOnly value={result.kind} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.normalized}</div>
            <textarea readOnly value={result.normalized} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.dateOutput}</div>
            <textarea readOnly value={result.date} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          </div>
        </div>
      )}
    </section>
  );
}
