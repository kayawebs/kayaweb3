"use client";

import { useMemo, useState } from "react";

import { getAddress, isAddress } from "ethers";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "cast to-checksum-address",
    input: "Address input",
    checksum: "Checksummed address",
    lowercase: "Lowercase address",
    example: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    invalid: "Enter a valid EVM address to convert.",
  },
  zh: {
    command: "cast to-checksum-address",
    input: "地址输入",
    checksum: "Checksum 地址",
    lowercase: "小写地址",
    example: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    invalid: "请输入一个有效的 EVM 地址后再转换。",
  },
} as const;

export default function EvmChecksumConverterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);

  const result = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed || !isAddress(trimmed)) {
      return { error: text.invalid };
    }

    const checksum = getAddress(trimmed);
    return {
      checksum,
      lowercase: checksum.toLowerCase(),
    };
  }, [input, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/evm-checksum-converter</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 lg:col-span-1">
          <label htmlFor="evm-checksum-converter-input" className="block text-sm font-medium">{text.input}</label>
          <textarea
            id="evm-checksum-converter-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={6}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
          {"error" in result && (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          )}
        </div>

        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.checksum}</div>
          <textarea
            readOnly
            value={"checksum" in result ? result.checksum : ""}
            rows={6}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none"
          />
        </div>

        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.lowercase}</div>
          <textarea
            readOnly
            value={"lowercase" in result ? result.lowercase : ""}
            rows={6}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none"
          />
        </div>
      </div>
    </section>
  );
}
