"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const decoder = new TextDecoder();

const TEXT = {
  en: {
    command: "xxd -r -b",
    input: "Binary input",
    output: "Decoded text",
    hint: "Enter binary bytes separated by spaces or line breaks.",
    invalid: "Binary input must contain only 0/1 digits in full 8-bit groups.",
    example: "01001000 01100101 01101100 01101100 01101111",
  },
  zh: {
    command: "xxd -r -b",
    input: "二进制输入",
    output: "解码文本",
    hint: "请输入按空格或换行分隔的二进制字节。",
    invalid: "二进制输入必须只包含 0/1，并且按完整 8 位字节分组。",
    example: "01001000 01100101 01101100 01101100 01101111",
  },
} as const;

function decodeBinary(input: string) {
  const compact = input.trim();
  if (!compact) return { output: "" };

  const groups = compact.split(/\s+/).filter(Boolean);
  if (groups.length === 1 && compact.length % 8 === 0 && /^[01]+$/.test(compact)) {
    const regrouped = compact.match(/.{1,8}/g) ?? [];
    return decodeBinary(regrouped.join(" "));
  }

  if (!groups.every((group) => /^[01]{8}$/.test(group))) {
    return { error: true };
  }

  try {
    const bytes = Uint8Array.from(groups, (group) => parseInt(group, 2));
    return { output: decoder.decode(bytes) };
  } catch {
    return { error: true };
  }
}

export default function BinaryToTextTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);

  const result = useMemo(() => decodeBinary(input), [input]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/binary-to-text</span>
        <span>{text.command}</span>
      </div>
      <p className="text-sm text-[var(--foreground)]/75">{text.hint}</p>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="binary-to-text-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="binary-to-text-input" value={input} onChange={(event) => setInput(event.target.value)} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="binary-to-text-output" className="block text-sm font-medium">{text.output}</label>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{text.invalid}</p>
          ) : (
            <textarea id="binary-to-text-output" readOnly value={result.output} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
