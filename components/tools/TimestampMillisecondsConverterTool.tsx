"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const MAX_JS_DATE_MS = 8.64e15;

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

function parseWholeNumber(value: string) {
  const cleaned = value.trim();
  if (!cleaned) return null;
  if (!/^-?\d+$/.test(cleaned)) return Number.NaN;
  return Number(cleaned);
}

const TEXT = {
  en: {
    command: "expr $ts '*' 1000",
    secondsInput: "Timestamp in seconds",
    millisecondsInput: "Timestamp in milliseconds",
    placeholderSeconds: "1714651200",
    placeholderMilliseconds: "1714651200000",
    clear: "clear",
    useNow: "use now",
    useNowMs: "use now ms",
    error: "Enter a whole number timestamp.",
    rangeError: "Value is outside the JavaScript Date range.",
    datePreview: "Date preview",
    iso: "ISO 8601",
    utc: "UTC",
    local: "Local",
  },
  zh: {
    command: "expr $ts '*' 1000",
    secondsInput: "秒级时间戳",
    millisecondsInput: "毫秒级时间戳",
    placeholderSeconds: "1714651200",
    placeholderMilliseconds: "1714651200000",
    clear: "清空",
    useNow: "使用当前秒级时间戳",
    useNowMs: "使用当前毫秒时间戳",
    error: "请输入整数时间戳。",
    rangeError: "该值超出 JavaScript Date 可处理范围。",
    datePreview: "日期预览",
    iso: "ISO 8601",
    utc: "UTC",
    local: "本地时间",
  },
} as const;

export default function TimestampMillisecondsConverterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const [secondsInput, setSecondsInput] = useState("1714651200");
  const [millisecondsInput, setMillisecondsInput] = useState("1714651200000");
  const text = TEXT[locale];

  const result = useMemo(() => {
    const secondsParsed = parseWholeNumber(secondsInput);
    const millisecondsParsed = parseWholeNumber(millisecondsInput);

    if (secondsInput.trim() && Number.isNaN(secondsParsed)) {
      return { error: text.error };
    }

    if (millisecondsInput.trim() && Number.isNaN(millisecondsParsed)) {
      return { error: text.error };
    }

    const hasSeconds = secondsParsed !== null && !Number.isNaN(secondsParsed);
    const hasMilliseconds = millisecondsParsed !== null && !Number.isNaN(millisecondsParsed);

    if (!hasSeconds && !hasMilliseconds) {
      return null;
    }

    const seconds = hasSeconds ? secondsParsed : Math.trunc((millisecondsParsed ?? 0) / 1000);
    const milliseconds = hasMilliseconds ? millisecondsParsed : (secondsParsed ?? 0) * 1000;
    const previewMilliseconds = hasMilliseconds ? milliseconds : seconds * 1000;

    if (Math.abs(previewMilliseconds) > MAX_JS_DATE_MS) {
      return { error: text.rangeError };
    }

    const date = new Date(previewMilliseconds);
    return {
      warning:
        hasSeconds && hasMilliseconds && secondsParsed! * 1000 !== millisecondsParsed
          ? locale === "zh"
            ? "两个输入框的值不一致，日期预览按当前毫秒输入优先展示。"
            : "The two fields do not match exactly. Date preview prefers the current milliseconds input."
          : undefined,
      seconds,
      milliseconds,
      iso: date.toISOString(),
      utc: date.toUTCString(),
      local: formatLocal(date, locale),
    };
  }, [locale, millisecondsInput, secondsInput, text.error, text.rangeError]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/timestamp-milliseconds-converter</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="seconds-input" className="block text-sm font-medium">
            {text.secondsInput}
          </label>
          <input
            id="seconds-input"
            value={secondsInput}
            onChange={(event) => {
              const value = event.target.value;
              setSecondsInput(value);
              const parsed = parseWholeNumber(value);
              if (parsed !== null && !Number.isNaN(parsed)) {
                setMillisecondsInput(String(parsed * 1000));
              }
            }}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]"
            inputMode="numeric"
            placeholder={text.placeholderSeconds}
          />
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => {
                const now = String(Math.floor(Date.now() / 1000));
                setSecondsInput(now);
                setMillisecondsInput(String(Number(now) * 1000));
              }}
              className="rounded border border-[var(--terminal-border)] px-2 py-1 hover:border-[var(--terminal-accent)]"
            >
              {text.useNow}
            </button>
            <button
              type="button"
              onClick={() => {
                setSecondsInput("");
                setMillisecondsInput("");
              }}
              className="rounded border border-[var(--terminal-border)] px-2 py-1 hover:border-[var(--terminal-accent)]"
            >
              {text.clear}
            </button>
          </div>
        </div>

        <div className="space-y-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="milliseconds-input" className="block text-sm font-medium">
            {text.millisecondsInput}
          </label>
          <input
            id="milliseconds-input"
            value={millisecondsInput}
            onChange={(event) => {
              const value = event.target.value;
              setMillisecondsInput(value);
              const parsed = parseWholeNumber(value);
              if (parsed !== null && !Number.isNaN(parsed)) {
                setSecondsInput(String(Math.trunc(parsed / 1000)));
              }
            }}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]"
            inputMode="numeric"
            placeholder={text.placeholderMilliseconds}
          />
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => {
                const now = Date.now();
                setMillisecondsInput(String(now));
                setSecondsInput(String(Math.trunc(now / 1000)));
              }}
              className="rounded border border-[var(--terminal-border)] px-2 py-1 hover:border-[var(--terminal-accent)]"
            >
              {text.useNowMs}
            </button>
            <button
              type="button"
              onClick={() => {
                setSecondsInput("");
                setMillisecondsInput("");
              }}
              className="rounded border border-[var(--terminal-border)] px-2 py-1 hover:border-[var(--terminal-accent)]"
            >
              {text.clear}
            </button>
          </div>
        </div>
      </div>

      {result?.error ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          {result.error}
        </p>
      ) : result ? (
        <div className="space-y-3">
          {result.warning && (
            <p className="rounded border border-[var(--terminal-border)] bg-[var(--background)]/40 px-3 py-2 text-sm text-[var(--terminal-muted)]">
              {result.warning}
            </p>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded border border-[var(--terminal-border)] p-3">
              <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.secondsInput}</div>
              <div className="mt-1 break-all font-mono">{result.seconds}</div>
            </div>
            <div className="rounded border border-[var(--terminal-border)] p-3">
              <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.millisecondsInput}</div>
              <div className="mt-1 break-all font-mono">{result.milliseconds}</div>
            </div>
          </div>

          {"iso" in result && (
            <div className="grid gap-3 sm:grid-cols-3">
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
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
