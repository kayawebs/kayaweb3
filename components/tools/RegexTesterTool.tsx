"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "grep -E",
    pattern: "Pattern",
    flags: "Flags",
    input: "Test text",
    summary: "Matches",
    invalid: "Invalid regular expression.",
    none: "No matches found.",
    examplePattern: "\\b[a-z]{4}\\b",
    exampleFlags: "gi",
    exampleInput: "Kaya ships fast tools.\nFour word list: code, test, ship.",
  },
  zh: {
    command: "grep -E",
    pattern: "表达式",
    flags: "标记",
    input: "测试文本",
    summary: "匹配结果",
    invalid: "正则表达式无效。",
    none: "没有匹配结果。",
    examplePattern: "\\b[a-z]{4}\\b",
    exampleFlags: "gi",
    exampleInput: "Kaya ships fast tools.\nFour word list: code, test, ship.",
  },
} as const;

type MatchEntry = {
  match: string;
  index: number;
  groups: string[];
};

export default function RegexTesterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [pattern, setPattern] = useState<string>(text.examplePattern);
  const [flags, setFlags] = useState<string>(text.exampleFlags);
  const [input, setInput] = useState<string>(text.exampleInput);

  const result = useMemo(() => {
    try {
      const normalizedFlags = Array.from(new Set(flags.replace(/[^dgimsuvy]/g, "").split(""))).join("");
      const regex = new RegExp(pattern, normalizedFlags.includes("g") ? normalizedFlags : `${normalizedFlags}g`);
      const matches: MatchEntry[] = Array.from(input.matchAll(regex)).map((entry) => ({
        match: entry[0],
        index: entry.index ?? 0,
        groups: entry.slice(1).filter((group): group is string => typeof group === "string"),
      }));
      return { matches, normalizedFlags };
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) };
    }
  }, [flags, input, pattern]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/regex-tester</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px]">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <span className="block text-sm font-medium">{text.pattern}</span>
          <input value={pattern} onChange={(event) => setPattern(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <span className="block text-sm font-medium">{text.flags}</span>
          <input value={flags} onChange={(event) => setFlags(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </label>
      </div>
      <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <label htmlFor="regex-tester-input" className="block text-sm font-medium">{text.input}</label>
        <textarea id="regex-tester-input" value={input} onChange={(event) => setInput(event.target.value)} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
      </div>
      <div className="space-y-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
        <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.summary}</div>
        {"error" in result ? (
          <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{text.invalid} {result.error}</p>
        ) : result.matches.length === 0 ? (
          <p className="text-sm text-[var(--terminal-muted)]">{text.none}</p>
        ) : (
          <div className="space-y-2">
            {result.matches.map((entry, index) => (
              <div key={`${entry.match}-${entry.index}-${index}`} className="rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/20 px-3 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-mono text-sm text-[var(--terminal-accent)]">{entry.match}</div>
                  <div className="text-[11px] font-mono text-[var(--terminal-muted)]">@{entry.index}</div>
                </div>
                {entry.groups.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {entry.groups.map((group, groupIndex) => (
                      <span key={`${group}-${groupIndex}`} className="rounded border border-[var(--terminal-border)] px-2 py-1 text-[11px] font-mono text-[var(--terminal-muted)]">
                        ${groupIndex + 1}: {group}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
