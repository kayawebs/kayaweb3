"use client";

import { useEffect, useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const SAMPLE_TEXT = {
  en: "Fast tools should feel immediate, readable, and reliable even when the logic stays simple.",
  zh: "快速工具应该在逻辑保持简单的同时，依然做到即时、清晰且可靠。",
} as const;

const TEXT = {
  en: {
    command: "wpm test",
    prompt: "Type this text",
    input: "Your input",
    reset: "Reset",
    status: "Status",
    idle: "Start typing to begin the test.",
    running: "Timer running.",
    complete: "Complete.",
    time: "Time",
    wpm: "WPM",
    accuracy: "Accuracy",
  },
  zh: {
    command: "wpm test",
    prompt: "输入这段文字",
    input: "你的输入",
    reset: "重置",
    status: "状态",
    idle: "开始输入后自动计时。",
    running: "计时进行中。",
    complete: "已完成。",
    time: "时间",
    wpm: "每分钟字数",
    accuracy: "准确率",
  },
} as const;

function calculateAccuracy(target: string, typed: string) {
  if (!typed.length) return 100;
  let correct = 0;
  for (let index = 0; index < typed.length; index += 1) {
    if (typed[index] === target[index]) {
      correct += 1;
    }
  }
  return (correct / typed.length) * 100;
}

export default function TypingSpeedTestTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const target = SAMPLE_TEXT[locale];
  const [input, setInput] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (startedAt === null || done) return;
    const timer = window.setInterval(() => {
      setElapsedMs(Date.now() - startedAt);
    }, 100);
    return () => window.clearInterval(timer);
  }, [done, startedAt]);

  const metrics = useMemo(() => {
    const accuracy = calculateAccuracy(target, input);
    const minutes = Math.max(elapsedMs / 60000, 1 / 60000);
    const words = input.trim().length / 5;
    const wpm = words / minutes;
    return { accuracy, wpm };
  }, [elapsedMs, input, target]);

  const handleChange = (value: string) => {
    if (startedAt === null && value.length > 0) {
      setStartedAt(Date.now());
    }
    setInput(value);
    if (value === target) {
      setDone(true);
      if (startedAt !== null) {
        setElapsedMs(Date.now() - startedAt);
      }
    } else if (done) {
      setDone(false);
    }
  };

  const reset = () => {
    setInput("");
    setStartedAt(null);
    setElapsedMs(0);
    setDone(false);
  };

  const status = done ? text.complete : startedAt === null ? text.idle : text.running;

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/typing-speed-test</span>
        <span>{text.command}</span>
      </div>
      <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
        <div className="text-sm font-medium">{text.prompt}</div>
        <p className="font-mono text-sm leading-7">{target}</p>
      </div>
      <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <span className="block text-sm font-medium">{text.input}</span>
        <textarea value={input} onChange={(event) => handleChange(event.target.value)} rows={6} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]" />
      </label>
      <div className="flex flex-wrap gap-4">
        <button type="button" onClick={reset} className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 px-4 py-3 font-mono hover:bg-[var(--terminal-panel-bg)]/70">
          {text.reset}
        </button>
      </div>
      <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4 text-sm">
        <span className="font-medium">{text.status}: </span>
        {status}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.time}</div>
          <div className="mt-2 font-mono text-lg">{(elapsedMs / 1000).toFixed(1)}s</div>
        </div>
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.wpm}</div>
          <div className="mt-2 font-mono text-lg">{Number.isFinite(metrics.wpm) ? metrics.wpm.toFixed(1) : "0.0"}</div>
        </div>
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.accuracy}</div>
          <div className="mt-2 font-mono text-lg">{metrics.accuracy.toFixed(1)}%</div>
        </div>
      </div>
    </section>
  );
}
