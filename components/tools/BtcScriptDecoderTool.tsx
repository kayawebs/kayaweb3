"use client";

import { useMemo, useState } from "react";

import { script as btcScript } from "bitcoinjs-lib";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "script.toASM",
    input: "Script hex",
    output: "Decoded script",
    invalid: "Enter a valid Bitcoin script hex string.",
    example: "76a914751e76e8199196d454941c45d1b3a323f1433bd688ac",
  },
  zh: {
    command: "script.toASM",
    input: "脚本 hex",
    output: "脚本解码结果",
    invalid: "请输入合法的 Bitcoin 脚本 hex 字符串。",
    example: "76a914751e76e8199196d454941c45d1b3a323f1433bd688ac",
  },
} as const;

function safeSerialize(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export default function BtcScriptDecoderTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);

  const result = useMemo(() => {
    const normalized = input.trim().replace(/^0x/i, "");
    if (!/^[0-9a-fA-F]*$/.test(normalized) || normalized.length % 2 !== 0 || !normalized) {
      return { error: text.invalid };
    }

    try {
      const bytes = Uint8Array.from(
        normalized.match(/.{1,2}/g)?.map((item) => Number.parseInt(item, 16)) ?? [],
      );
      const chunks = btcScript.decompile(bytes);
      if (!chunks) {
        return { error: text.invalid };
      }

      return {
        output: safeSerialize({
          asm: btcScript.toASM(bytes),
          lengthBytes: bytes.length,
          chunks: chunks.map((item) =>
            typeof item === "number"
              ? { type: "opcode", value: item, name: btcScript.OPS[item] ?? null }
              : { type: "data", hex: Array.from(item, (byte) => byte.toString(16).padStart(2, "0")).join("") },
          ),
        }),
      };
    } catch {
      return { error: text.invalid };
    }
  }, [input, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/btc-script-decoder</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="btc-script-decoder-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="btc-script-decoder-input" value={input} onChange={(event) => setInput(event.target.value)} rows={10} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.output}</div>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <textarea readOnly value={result.output} rows={10} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
