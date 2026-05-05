"use client";

import { useEffect, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const DURATION_SECONDS = 5;

const TEXT = {
  en: {
    command: "cps test",
    start: "Start test",
    click: "Click here",
    reset: "Reset",
    statusIdle: "Start the timer, then click as fast as you can for 5 seconds.",
    statusRunning: "Timer running.",
    statusDone: "Test complete.",
    clicks: "Clicks",
    cps: "Clicks per second",
    timeLeft: "Time left",
  },
  zh: {
    command: "cps test",
    start: "开始测试",
    click: "点这里",
    reset: "重置",
    statusIdle: "启动后，在 5 秒内尽可能快地点击。",
    statusRunning: "计时进行中。",
    statusDone: "测试结束。",
    clicks: "点击次数",
    cps: "每秒点击",
    timeLeft: "剩余时间",
  },
} as const;

export default function ClickSpeedTestTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [running, setRunning] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION_SECONDS);

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          setRunning(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [running, timeLeft]);

  const start = () => {
    setClicks(0);
    setTimeLeft(DURATION_SECONDS);
    setRunning(true);
  };

  const reset = () => {
    setRunning(false);
    setClicks(0);
    setTimeLeft(DURATION_SECONDS);
  };

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/click-speed-test</span>
        <span>{text.command}</span>
      </div>
      <div className="flex flex-wrap gap-4">
        <button type="button" onClick={start} className="rounded-lg border border-[var(--terminal-accent)] bg-[var(--terminal-panel-bg)]/40 px-4 py-3 font-mono hover:bg-[var(--terminal-panel-bg)]/70">
          {text.start}
        </button>
        <button type="button" onClick={reset} className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 px-4 py-3 font-mono hover:bg-[var(--terminal-panel-bg)]/70">
          {text.reset}
        </button>
      </div>
      <button type="button" disabled={!running} onClick={() => running && setClicks((value) => value + 1)} className="w-full rounded-lg border border-[var(--terminal-accent)] bg-[var(--terminal-panel-bg)]/30 px-4 py-10 text-center font-mono text-2xl disabled:cursor-not-allowed disabled:opacity-50">
        {text.click}
      </button>
      <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4 text-sm">
        {running ? text.statusRunning : clicks > 0 ? text.statusDone : text.statusIdle}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.clicks}</div>
          <div className="mt-2 font-mono text-lg">{clicks}</div>
        </div>
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.cps}</div>
          <div className="mt-2 font-mono text-lg">{(clicks / DURATION_SECONDS).toFixed(2)}</div>
        </div>
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.timeLeft}</div>
          <div className="mt-2 font-mono text-lg">{timeLeft}s</div>
        </div>
      </div>
    </section>
  );
}
