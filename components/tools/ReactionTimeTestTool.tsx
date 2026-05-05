"use client";

import { useEffect, useRef, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "reaction test",
    start: "Start",
    reset: "Reset",
    waiting: "Wait for green...",
    ready: "Click now",
    early: "Too early.",
    idle: "Press start to begin.",
    best: "Reaction time",
  },
  zh: {
    command: "reaction test",
    start: "开始",
    reset: "重置",
    waiting: "等待变绿...",
    ready: "现在点击",
    early: "点早了。",
    idle: "点击开始。",
    best: "反应时间",
  },
} as const;

type Phase = "idle" | "waiting" | "ready" | "done" | "early";

export default function ReactionTimeTestTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [phase, setPhase] = useState<Phase>("idle");
  const [resultMs, setResultMs] = useState<number | null>(null);
  const startRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const start = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    setPhase("waiting");
    setResultMs(null);
    const wait = 2000 + Math.floor(Math.random() * 3000);
    timeoutRef.current = window.setTimeout(() => {
      startRef.current = performance.now();
      setPhase("ready");
    }, wait);
  };

  const reset = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    setPhase("idle");
    setResultMs(null);
    startRef.current = null;
  };

  const handleClick = () => {
    if (phase === "waiting") {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      setPhase("early");
      return;
    }
    if (phase === "ready" && startRef.current !== null) {
      setResultMs(Math.round(performance.now() - startRef.current));
      setPhase("done");
    }
  };

  const panelText =
    phase === "waiting" ? text.waiting : phase === "ready" ? text.ready : phase === "early" ? text.early : phase === "done" ? `${resultMs ?? "-"} ms` : text.idle;

  const panelClass =
    phase === "ready"
      ? "border-emerald-500/70 bg-emerald-500/20"
      : phase === "early"
        ? "border-amber-500/50 bg-amber-500/10"
        : "border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30";

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/reaction-time-test</span>
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
      <button type="button" onClick={handleClick} className={`w-full rounded-lg border px-4 py-14 text-center font-mono text-2xl transition-colors ${panelClass}`}>
        {panelText}
      </button>
      <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
        <div className="text-sm font-medium">{text.best}</div>
        <div className="mt-2 font-mono text-lg">{resultMs === null ? "-" : `${resultMs} ms`}</div>
      </div>
    </section>
  );
}
