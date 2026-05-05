"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?";
const AMBIGUOUS = "O0Il1";

const TEXT = {
  en: {
    command: "openssl rand",
    length: "Length",
    count: "Count",
    lower: "Lowercase",
    upper: "Uppercase",
    numbers: "Numbers",
    symbols: "Symbols",
    exclude: "Exclude ambiguous",
    output: "Generated strings",
    hint: "Choose at least one character set.",
  },
  zh: {
    command: "openssl rand",
    length: "长度",
    count: "数量",
    lower: "小写字母",
    upper: "大写字母",
    numbers: "数字",
    symbols: "符号",
    exclude: "排除易混淆字符",
    output: "生成结果",
    hint: "至少选择一种字符集。",
  },
} as const;

function buildCharset(options: {
  lower: boolean;
  upper: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}) {
  let charset = "";
  if (options.lower) charset += LOWER;
  if (options.upper) charset += UPPER;
  if (options.numbers) charset += NUMBERS;
  if (options.symbols) charset += SYMBOLS;
  if (options.excludeAmbiguous) {
    charset = charset
      .split("")
      .filter((char) => !AMBIGUOUS.includes(char))
      .join("");
  }
  return charset;
}

function makeString(length: number, charset: string) {
  const buffer = new Uint32Array(length);
  crypto.getRandomValues(buffer);
  return Array.from(buffer, (value) => charset[value % charset.length]).join("");
}

export default function RandomStringGeneratorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(5);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);

  const output = useMemo(() => {
    const safeLength = Math.min(Math.max(length, 1), 128);
    const safeCount = Math.min(Math.max(count, 1), 20);
    const charset = buildCharset({ lower, upper, numbers, symbols, excludeAmbiguous });

    if (!charset) {
      return { error: text.hint };
    }

    return {
      values: Array.from({ length: safeCount }, () => makeString(safeLength, charset)),
    };
  }, [count, excludeAmbiguous, length, lower, numbers, symbols, text.hint, upper]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/random-string-generator</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <span className="block text-sm font-medium">{text.length}</span>
          <input type="number" min={1} max={128} value={length} onChange={(event) => setLength(Number(event.target.value) || 1)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <span className="block text-sm font-medium">{text.count}</span>
          <input type="number" min={1} max={20} value={count} onChange={(event) => setCount(Number(event.target.value) || 1)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <label className="flex items-center gap-2 rounded border border-[var(--terminal-border)] px-3 py-2 text-sm">
          <input type="checkbox" checked={lower} onChange={(event) => setLower(event.target.checked)} />
          <span>{text.lower}</span>
        </label>
        <label className="flex items-center gap-2 rounded border border-[var(--terminal-border)] px-3 py-2 text-sm">
          <input type="checkbox" checked={upper} onChange={(event) => setUpper(event.target.checked)} />
          <span>{text.upper}</span>
        </label>
        <label className="flex items-center gap-2 rounded border border-[var(--terminal-border)] px-3 py-2 text-sm">
          <input type="checkbox" checked={numbers} onChange={(event) => setNumbers(event.target.checked)} />
          <span>{text.numbers}</span>
        </label>
        <label className="flex items-center gap-2 rounded border border-[var(--terminal-border)] px-3 py-2 text-sm">
          <input type="checkbox" checked={symbols} onChange={(event) => setSymbols(event.target.checked)} />
          <span>{text.symbols}</span>
        </label>
        <label className="flex items-center gap-2 rounded border border-[var(--terminal-border)] px-3 py-2 text-sm">
          <input type="checkbox" checked={excludeAmbiguous} onChange={(event) => setExcludeAmbiguous(event.target.checked)} />
          <span>{text.exclude}</span>
        </label>
      </div>

      <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <label htmlFor="random-string-output" className="block text-sm font-medium">{text.output}</label>
        {"error" in output ? (
          <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{output.error}</p>
        ) : (
          <textarea id="random-string-output" readOnly value={output.values.join("\n")} rows={10} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
        )}
      </div>
    </section>
  );
}
