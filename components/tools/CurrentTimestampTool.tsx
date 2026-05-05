"use client";

import { useEffect, useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

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
    command: "date +%s",
    title: "Live Unix Timestamp",
    live: "live",
    seconds: "seconds",
    milliseconds: "milliseconds",
    iso: "ISO 8601",
    utc: "UTC",
    local: "Local",
    refresh: "updates every second in your browser",
  },
  zh: {
    command: "date +%s",
    title: "实时 Unix 时间戳",
    live: "实时",
    seconds: "秒",
    milliseconds: "毫秒",
    iso: "ISO 8601",
    utc: "UTC",
    local: "本地时间",
    refresh: "浏览器内每秒自动更新",
  },
} as const;

export default function CurrentTimestampTool({ locale = "en" }: { locale?: ToolLocale }) {
  const [nowMs, setNowMs] = useState<number | null>(null);
  const text = TEXT[locale];

  useEffect(() => {
    const update = () => setNowMs(Date.now());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const snapshot = useMemo(() => {
    if (nowMs === null) return null;
    const current = new Date(nowMs);
    return {
      seconds: Math.floor(nowMs / 1000),
      milliseconds: nowMs,
      iso: current.toISOString(),
      utc: current.toUTCString(),
      local: formatLocal(current, locale),
    };
  }, [locale, nowMs]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/current-timestamp</span>
        <span>{text.command}</span>
      </div>

      <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{text.title}</h2>
            <p className="mt-1 text-xs text-[var(--terminal-muted)]">{text.refresh}</p>
          </div>
          <span className="rounded border border-green-500/40 px-2 py-1 text-[10px] font-mono text-green-400">
            {text.live}
          </span>
        </div>

        {snapshot && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded border border-[var(--terminal-border)] p-3">
              <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.seconds}</div>
              <div className="mt-1 break-all font-mono text-lg">{snapshot.seconds}</div>
            </div>
            <div className="rounded border border-[var(--terminal-border)] p-3">
              <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.milliseconds}</div>
              <div className="mt-1 break-all font-mono text-lg">{snapshot.milliseconds}</div>
            </div>
            <div className="rounded border border-[var(--terminal-border)] p-3">
              <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.iso}</div>
              <div className="mt-1 break-all font-mono text-sm">{snapshot.iso}</div>
            </div>
            <div className="rounded border border-[var(--terminal-border)] p-3">
              <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.utc}</div>
              <div className="mt-1 break-all text-sm">{snapshot.utc}</div>
            </div>
            <div className="rounded border border-[var(--terminal-border)] p-3 sm:col-span-2">
              <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.local}</div>
              <div className="mt-1 break-all text-sm">{snapshot.local}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
