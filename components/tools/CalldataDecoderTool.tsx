"use client";

import { useMemo, useState } from "react";

import { Interface } from "ethers";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "Interface.parseTransaction",
    fragment: "Function fragment",
    data: "Calldata",
    output: "Decoded calldata",
    invalid: "Enter a valid function fragment and calldata hex string.",
    exampleFragment: "function transfer(address to, uint256 amount)",
    exampleData: "0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa960450000000000000000000000000000000000000000000000000de0b6b3a7640000",
  },
  zh: {
    command: "Interface.parseTransaction",
    fragment: "函数片段",
    data: "Calldata",
    output: "Calldata 解码结果",
    invalid: "请输入合法的函数片段和 calldata hex 字符串。",
    exampleFragment: "function transfer(address to, uint256 amount)",
    exampleData: "0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa960450000000000000000000000000000000000000000000000000de0b6b3a7640000",
  },
} as const;

function safeSerialize(value: unknown) {
  return JSON.stringify(
    value,
    (_, current) => (typeof current === "bigint" ? current.toString() : current),
    2,
  );
}

export default function CalldataDecoderTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [fragment, setFragment] = useState<string>(text.exampleFragment);
  const [data, setData] = useState<string>(text.exampleData);

  const result = useMemo(() => {
    try {
      const iface = new Interface([fragment]);
      const parsed = iface.parseTransaction({ data: data.trim() });
      if (!parsed) {
        return { error: text.invalid };
      }
      return {
        output: safeSerialize({
          name: parsed.name,
          signature: parsed.signature,
          selector: parsed.selector,
          value: parsed.value.toString(),
          args: parsed.args.toArray(true),
        }),
      };
    } catch {
      return { error: text.invalid };
    }
  }, [data, fragment, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/calldata-decoder</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <label htmlFor="calldata-decoder-fragment" className="block text-sm font-medium">{text.fragment}</label>
            <textarea id="calldata-decoder-fragment" value={fragment} onChange={(event) => setFragment(event.target.value)} rows={4} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <label htmlFor="calldata-decoder-data" className="block text-sm font-medium">{text.data}</label>
            <textarea id="calldata-decoder-data" value={data} onChange={(event) => setData(event.target.value)} rows={8} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
          </div>
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.output}</div>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <textarea readOnly value={result.output} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
