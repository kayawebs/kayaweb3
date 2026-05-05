"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

type OutputMode = "chat" | "bullet";

const TEXT = {
  en: {
    command: "chat format",
    input: "Raw conversation",
    mode: "Output mode",
    output: "Formatted result",
    chat: "Chat roles",
    bullet: "Bullet notes",
    example: "User: How do I estimate BTC fees?\nAssistant: Start with vbytes and target sat/vB.\nUser: Show me a quick example.",
  },
  zh: {
    command: "chat format",
    input: "原始对话",
    mode: "输出模式",
    output: "整理结果",
    chat: "Chat roles",
    bullet: "要点列表",
    example: "User: How do I estimate BTC fees?\nAssistant: Start with vbytes and target sat/vB.\nUser: Show me a quick example.",
  },
} as const;

function toChatFormat(input: string) {
  return input
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (/^(user|assistant|system)\s*:/i.test(line)) {
        const [role, ...rest] = line.split(":");
        return `${role.trim().toLowerCase()}: ${rest.join(":").trim()}`;
      }
      return `user: ${line}`;
    })
    .join("\n");
}

function toBulletFormat(input: string) {
  return input
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `- ${line}`)
    .join("\n");
}

export default function ChatFormatConverterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);
  const [mode, setMode] = useState<OutputMode>("chat");

  const output = useMemo(() => (mode === "chat" ? toChatFormat(input) : toBulletFormat(input)), [input, mode]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/chat-format-converter</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="chat-format-converter-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="chat-format-converter-input" value={input} onChange={(event) => setInput(event.target.value)} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-4">
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <label htmlFor="chat-format-converter-mode" className="block text-sm font-medium">{text.mode}</label>
            <select id="chat-format-converter-mode" value={mode} onChange={(event) => setMode(event.target.value as OutputMode)} className="w-full rounded border border-[var(--terminal-border)] bg-[var(--background)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]">
              <option value="chat">{text.chat}</option>
              <option value="bullet">{text.bullet}</option>
            </select>
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <div className="text-sm font-medium">{text.output}</div>
            <textarea readOnly value={output} rows={11} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
