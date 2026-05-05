"use client";

import { useMemo, useState } from "react";

import { AbiCoder } from "ethers";

import type { ToolLocale } from "@/lib/tool-i18n";

const coder = AbiCoder.defaultAbiCoder();

const TEXT = {
  en: {
    command: "abi.decode(...)",
    types: "ABI types",
    data: "Encoded data",
    output: "Decoded values",
    invalidTypes: "Enter at least one ABI type.",
    invalidDecode: "Unable to ABI-decode the provided data.",
    typesExample: "address,uint256,string",
    dataExample:
      "0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa960450000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000",
  },
  zh: {
    command: "abi.decode(...)",
    types: "ABI 类型",
    data: "编码后的数据",
    output: "解码结果",
    invalidTypes: "请至少输入一个 ABI 类型。",
    invalidDecode: "当前类型和数据无法成功进行 ABI 解码。",
    typesExample: "address,uint256,string",
    dataExample:
      "0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa960450000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000",
  },
} as const;

function parseTypes(input: string) {
  return input
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function safeSerialize(value: unknown) {
  return JSON.stringify(
    value,
    (_, current) => (typeof current === "bigint" ? current.toString() : current),
    2,
  );
}

export default function AbiDecodeTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [typesInput, setTypesInput] = useState<string>(text.typesExample);
  const [dataInput, setDataInput] = useState<string>(text.dataExample);

  const result = useMemo(() => {
    const types = parseTypes(typesInput);
    if (!types.length) {
      return { error: text.invalidTypes };
    }

    try {
      const decoded = coder.decode(types, dataInput.trim());
      return {
        output: safeSerialize(Array.from(decoded)),
      };
    } catch {
      return { error: text.invalidDecode };
    }
  }, [dataInput, text.invalidDecode, text.invalidTypes, typesInput]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/abi-decode-tool</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="abi-decode-types" className="block text-sm font-medium">{text.types}</label>
          <textarea
            id="abi-decode-types"
            value={typesInput}
            onChange={(event) => setTypesInput(event.target.value)}
            rows={6}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
        </div>

        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="abi-decode-data" className="block text-sm font-medium">{text.data}</label>
          <textarea
            id="abi-decode-data"
            value={dataInput}
            onChange={(event) => setDataInput(event.target.value)}
            rows={6}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <div className="text-sm font-medium">{text.output}</div>
        {"error" in result ? (
          <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
        ) : (
          <textarea readOnly value={result.output} rows={10} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
        )}
      </div>
    </section>
  );
}
