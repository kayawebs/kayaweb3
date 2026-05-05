"use client";

import { useMemo, useState } from "react";

import { getBytes, isHexString } from "ethers";

import type { ToolLocale } from "@/lib/tool-i18n";

const EIP170_LIMIT = 24576;

const TEXT = {
  en: {
    command: "analyze bytecode",
    input: "Contract bytecode",
    output: "Bytecode analysis",
    invalid: "Enter a valid 0x-prefixed contract bytecode hex string.",
    example:
      "0x6080604052348015600f57600080fd5b506040516101203803806101208339818101604052810190602f9190606d565b600080546001600160a01b0319163317905560b6806100516000396000f3fe6080604052600080fdfea2646970667358221220d3ef7a7f5f1d8b7b2f63ea41f4ed3a54dd0f0d9d7e0dbcb0a6e51f3d0f0de2a464736f6c634300081a0033",
  },
  zh: {
    command: "analyze bytecode",
    input: "合约字节码",
    output: "字节码分析结果",
    invalid: "请输入合法的 0x 前缀合约字节码 hex 字符串。",
    example:
      "0x6080604052348015600f57600080fd5b506040516101203803806101208339818101604052810190602f9190606d565b600080546001600160a01b0319163317905560b6806100516000396000f3fe6080604052600080fdfea2646970667358221220d3ef7a7f5f1d8b7b2f63ea41f4ed3a54dd0f0d9d7e0dbcb0a6e51f3d0f0de2a464736f6c634300081a0033",
  },
} as const;

function safeSerialize(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export default function ContractBytecodeAnalyzerTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);

  const result = useMemo(() => {
    const trimmed = input.trim();
    if (!isHexString(trimmed)) {
      return { error: text.invalid };
    }

    try {
      const bytes = getBytes(trimmed);
      const metadataLength = bytes.length >= 2 ? (bytes[bytes.length - 2] << 8) + bytes[bytes.length - 1] : 0;
      const metadataTrailerBytes = metadataLength > 0 && metadataLength + 2 <= bytes.length ? metadataLength + 2 : 0;
      const runtimeCandidate = trimmed.includes("fe") ? trimmed.slice(trimmed.lastIndexOf("fe") + 2) : "";

      return {
        output: safeSerialize({
          bytes: bytes.length,
          words32: Math.ceil(bytes.length / 32),
          kilobytes: Number((bytes.length / 1024).toFixed(3)),
          exceedsEip170: bytes.length > EIP170_LIMIT,
          eip170Remaining: Math.max(EIP170_LIMIT - bytes.length, 0),
          eip170UsagePct: Number(((bytes.length / EIP170_LIMIT) * 100).toFixed(2)),
          likelyMetadataTrailerBytes: metadataTrailerBytes || null,
          startsWithEofMagic: bytes[0] === 0xef && bytes[1] === 0x00,
          containsSolcMetadataMarker: trimmed.includes("a2646970667358") || trimmed.includes("a264697066735822"),
          prefix16Bytes: `0x${Array.from(bytes.slice(0, 16), (byte) => byte.toString(16).padStart(2, "0")).join("")}`,
          suffix16Bytes: `0x${Array.from(bytes.slice(-16), (byte) => byte.toString(16).padStart(2, "0")).join("")}`,
          likelyRuntimeByteLength: runtimeCandidate ? runtimeCandidate.length / 2 : null,
        }),
      };
    } catch {
      return { error: text.invalid };
    }
  }, [input, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/contract-bytecode-analyzer</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="contract-bytecode-analyzer-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="contract-bytecode-analyzer-input" value={input} onChange={(event) => setInput(event.target.value)} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
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
