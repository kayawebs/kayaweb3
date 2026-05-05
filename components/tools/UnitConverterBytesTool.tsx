"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const DECIMAL_UNITS = ["B", "KB", "MB", "GB", "TB"] as const;
const BINARY_UNITS = ["B", "KiB", "MiB", "GiB", "TiB"] as const;

const TEXT = {
  en: {
    command: "bytes convert",
    bytes: "Bytes",
    output: "Decimal and binary units",
    invalid: "Enter a non-negative integer byte value.",
  },
  zh: {
    command: "bytes convert",
    bytes: "字节数",
    output: "十进制和二进制单位",
    invalid: "请输入非负整数字节值。",
  },
} as const;

export default function UnitConverterBytesTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [bytes, setBytes] = useState("1048576");

  const result = useMemo(() => {
    const parsed = Number.parseInt(bytes, 10);
    if (!Number.isFinite(parsed) || parsed < 0) return { error: text.invalid };
    return {
      values: [
        ...DECIMAL_UNITS.map((unit, index) => `${unit}: ${(parsed / 1000 ** index).toFixed(6).replace(/\.?0+$/, "")}`),
        ...BINARY_UNITS.map((unit, index) => `${unit}: ${(parsed / 1024 ** index).toFixed(6).replace(/\.?0+$/, "")}`),
      ],
    };
  }, [bytes, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/unit-converter-bytes</span>
        <span>{text.command}</span>
      </div>
      <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
        <span className="block text-sm font-medium">{text.bytes}</span>
        <input value={bytes} onChange={(event) => setBytes(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
      </label>
      <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <div className="text-sm font-medium">{text.output}</div>
        {"error" in result ? (
          <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
        ) : (
          <textarea readOnly value={result.values.join("\n")} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
        )}
      </div>
    </section>
  );
}
