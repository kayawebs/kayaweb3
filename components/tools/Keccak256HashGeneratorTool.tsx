"use client";

import { useMemo, useState } from "react";

import { getBytes, keccak256, toUtf8Bytes } from "ethers";

import type { ToolLocale } from "@/lib/tool-i18n";

type InputMode = "text" | "hex";

const TEXT = {
  en: {
    command: "cast keccak",
    mode: "Input mode",
    text: "Text",
    hex: "Hex bytes",
    input: "Input",
    output: "Keccak-256 hash",
    exampleText: "hello web3",
    exampleHex: "0x68656c6c6f2077656233",
    invalidHex: "Enter valid 0x-prefixed hex bytes.",
  },
  zh: {
    command: "cast keccak",
    mode: "输入模式",
    text: "文本",
    hex: "Hex 字节",
    input: "输入内容",
    output: "Keccak-256 哈希",
    exampleText: "hello web3",
    exampleHex: "0x68656c6c6f2077656233",
    invalidHex: "请输入合法的 0x 前缀 hex 字节串。",
  },
} as const;

export default function Keccak256HashGeneratorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [mode, setMode] = useState<InputMode>("text");
  const [input, setInput] = useState<string>(text.exampleText);

  const result = useMemo(() => {
    try {
      const value = mode === "text" ? keccak256(toUtf8Bytes(input)) : keccak256(getBytes(input.trim()));
      return { output: value };
    } catch {
      return { error: text.invalidHex };
    }
  }, [input, mode, text.invalidHex]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/keccak256-hash-generator</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="keccak-mode" className="block text-sm font-medium">{text.mode}</label>
          <select
            id="keccak-mode"
            value={mode}
            onChange={(event) => {
              const nextMode = event.target.value as InputMode;
              setMode(nextMode);
              setInput(nextMode === "text" ? text.exampleText : text.exampleHex);
            }}
            className="w-full rounded border border-[var(--terminal-border)] bg-[var(--background)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
          >
            <option value="text">{text.text}</option>
            <option value="hex">{text.hex}</option>
          </select>
        </div>

        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="keccak-input" className="block text-sm font-medium">{text.input}</label>
          <textarea
            id="keccak-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={4}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <div className="text-sm font-medium">{text.output}</div>
        {"error" in result ? (
          <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
        ) : (
          <textarea
            readOnly
            value={result.output}
            rows={4}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none"
          />
        )}
      </div>
    </section>
  );
}
