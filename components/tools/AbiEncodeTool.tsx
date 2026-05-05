"use client";

import { useMemo, useState } from "react";

import { AbiCoder } from "ethers";

import type { ToolLocale } from "@/lib/tool-i18n";

const coder = AbiCoder.defaultAbiCoder();

const TEXT = {
  en: {
    command: "abi.encode(...)",
    types: "ABI types",
    values: "Values (JSON array)",
    output: "Encoded calldata payload",
    invalidTypes: "Enter at least one ABI type.",
    invalidValues: "Values must be a valid JSON array.",
    invalidEncode: "Unable to ABI-encode the provided types and values.",
    typesExample: "address,uint256,string",
    valuesExample: '["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045","1000000000000000000","hello"]',
  },
  zh: {
    command: "abi.encode(...)",
    types: "ABI 类型",
    values: "参数值（JSON 数组）",
    output: "编码结果",
    invalidTypes: "请至少输入一个 ABI 类型。",
    invalidValues: "参数值必须是合法的 JSON 数组。",
    invalidEncode: "当前类型和值无法成功进行 ABI 编码。",
    typesExample: "address,uint256,string",
    valuesExample: '["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045","1000000000000000000","hello"]',
  },
} as const;

function parseTypes(input: string) {
  return input
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AbiEncodeTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [typesInput, setTypesInput] = useState<string>(text.typesExample);
  const [valuesInput, setValuesInput] = useState<string>(text.valuesExample);

  const result = useMemo(() => {
    const types = parseTypes(typesInput);
    if (!types.length) {
      return { error: text.invalidTypes };
    }

    let values: unknown;
    try {
      values = JSON.parse(valuesInput);
    } catch {
      return { error: text.invalidValues };
    }

    if (!Array.isArray(values)) {
      return { error: text.invalidValues };
    }

    try {
      return {
        output: coder.encode(types, values),
      };
    } catch {
      return { error: text.invalidEncode };
    }
  }, [text.invalidEncode, text.invalidTypes, text.invalidValues, typesInput, valuesInput]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/abi-encode-tool</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="abi-encode-types" className="block text-sm font-medium">{text.types}</label>
          <textarea
            id="abi-encode-types"
            value={typesInput}
            onChange={(event) => setTypesInput(event.target.value)}
            rows={6}
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
          />
        </div>

        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="abi-encode-values" className="block text-sm font-medium">{text.values}</label>
          <textarea
            id="abi-encode-values"
            value={valuesInput}
            onChange={(event) => setValuesInput(event.target.value)}
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
          <textarea readOnly value={result.output} rows={8} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
        )}
      </div>
    </section>
  );
}
