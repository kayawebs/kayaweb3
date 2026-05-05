"use client";

import { useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "guess number",
    input: "Your guess (1-100)",
    submit: "Submit guess",
    reset: "New game",
    tries: "Attempts",
    tooLow: "Too low.",
    tooHigh: "Too high.",
    correct: "Correct.",
    idle: "Guess a number between 1 and 100.",
  },
  zh: {
    command: "guess number",
    input: "你的猜测（1-100）",
    submit: "提交猜测",
    reset: "新游戏",
    tries: "尝试次数",
    tooLow: "太小了。",
    tooHigh: "太大了。",
    correct: "猜对了。",
    idle: "猜一个 1 到 100 之间的数字。",
  },
} as const;

function createTarget() {
  return Math.floor(Math.random() * 100) + 1;
}

export default function NumberGuessingGameTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [target, setTarget] = useState(() => createTarget());
  const [guess, setGuess] = useState("50");
  const [message, setMessage] = useState<string>(text.idle);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = () => {
    const value = Number.parseInt(guess, 10);
    if (!Number.isFinite(value)) return;
    setAttempts((count) => count + 1);
    if (value < target) {
      setMessage(text.tooLow);
      return;
    }
    if (value > target) {
      setMessage(text.tooHigh);
      return;
    }
    setMessage(text.correct);
  };

  const handleReset = () => {
    setTarget(createTarget());
    setAttempts(0);
    setMessage(text.idle);
  };

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/number-guessing-game</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_180px_180px]">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <span className="block text-sm font-medium">{text.input}</span>
          <input value={guess} onChange={(event) => setGuess(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </label>
        <button type="button" onClick={handleSubmit} className="rounded-lg border border-[var(--terminal-accent)] bg-[var(--terminal-panel-bg)]/40 px-4 py-6 text-center font-mono hover:bg-[var(--terminal-panel-bg)]/70">
          {text.submit}
        </button>
        <button type="button" onClick={handleReset} className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 px-4 py-6 text-center font-mono hover:bg-[var(--terminal-panel-bg)]/70">
          {text.reset}
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">status</div>
          <div className="mt-2 font-mono text-lg">{message}</div>
        </div>
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.tries}</div>
          <div className="mt-2 font-mono text-lg">{attempts}</div>
        </div>
      </div>
    </section>
  );
}
