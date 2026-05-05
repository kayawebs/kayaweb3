"use client";

import { useMemo, useState } from "react";

import { getAddress, isAddress } from "ethers";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "cast wallet address",
    input: "EVM address",
    status: "Status",
    normalized: "Lowercase address",
    checksum: "Checksum address",
    example: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    empty: "Enter an EVM address to validate.",
    invalid: "This is not a valid EVM address.",
    validChecksum: "Valid EIP-55 checksum address.",
    validPlain: "Valid address, but not checksummed.",
  },
  zh: {
    command: "cast wallet address",
    input: "EVM 地址",
    status: "校验结果",
    normalized: "小写地址",
    checksum: "Checksum 地址",
    example: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    empty: "请输入一个 EVM 地址进行校验。",
    invalid: "这不是一个有效的 EVM 地址。",
    validChecksum: "这是一个有效的 EIP-55 checksum 地址。",
    validPlain: "地址本身有效，但不是 checksum 格式。",
  },
} as const;

export default function EvmAddressCheckerTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);

  const result = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return { message: text.empty };
    if (!isAddress(trimmed)) return { error: text.invalid };

    const checksum = getAddress(trimmed);
    const normalized = checksum.toLowerCase();
    const checksummed = trimmed === checksum;

    return {
      message: checksummed ? text.validChecksum : text.validPlain,
      normalized,
      checksum,
      checksummed,
    };
  }, [input, text]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/evm-address-checker</span>
        <span>{text.command}</span>
      </div>

      <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <label htmlFor="evm-address-checker-input" className="block text-sm font-medium">{text.input}</label>
        <input
          id="evm-address-checker-input"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.status}</div>
          {"error" in result ? (
            <p className="rounded border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{result.error}</p>
          ) : (
            <p className="rounded border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{result.message}</p>
          )}
        </div>

        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.normalized}</div>
          <textarea
            readOnly
            value={"normalized" in result ? result.normalized ?? "" : ""}
            rows={3}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none"
          />
        </div>

        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.checksum}</div>
          <textarea
            readOnly
            value={"checksum" in result ? result.checksum ?? "" : ""}
            rows={3}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none"
          />
        </div>
      </div>
    </section>
  );
}
