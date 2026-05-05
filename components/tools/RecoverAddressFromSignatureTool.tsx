"use client";

import { useMemo, useState } from "react";

import { verifyMessage } from "ethers";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "recover address",
    message: "Message",
    signature: "Signature",
    output: "Recovered address",
    invalid: "Enter a valid message and EIP-191 signature.",
    exampleMessage: "hello web3",
    exampleSignature:
      "0x1476abb7400f554d17aa1f8f4fd95c20d30c0a4f719216a4ac645b3b1f97b20c4a95cf8ed62f8676b29d2fcbf9fba1c6f484df5d5f604fa6cf64de31ee26d27f1b",
  },
  zh: {
    command: "recover address",
    message: "消息内容",
    signature: "签名",
    output: "恢复出的地址",
    invalid: "请输入有效的消息和 EIP-191 签名。",
    exampleMessage: "hello web3",
    exampleSignature:
      "0x1476abb7400f554d17aa1f8f4fd95c20d30c0a4f719216a4ac645b3b1f97b20c4a95cf8ed62f8676b29d2fcbf9fba1c6f484df5d5f604fa6cf64de31ee26d27f1b",
  },
} as const;

export default function RecoverAddressFromSignatureTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [message, setMessage] = useState<string>(text.exampleMessage);
  const [signature, setSignature] = useState<string>(text.exampleSignature);

  const result = useMemo(() => {
    try {
      return { output: verifyMessage(message, signature.trim()) };
    } catch {
      return { error: text.invalid };
    }
  }, [message, signature, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/recover-address-from-signature</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="recover-message" className="block text-sm font-medium">{text.message}</label>
          <textarea id="recover-message" value={message} onChange={(event) => setMessage(event.target.value)} rows={4} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="recover-signature" className="block text-sm font-medium">{text.signature}</label>
          <textarea id="recover-signature" value={signature} onChange={(event) => setSignature(event.target.value)} rows={5} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <div className="text-sm font-medium">{text.output}</div>
        {"error" in result ? (
          <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
        ) : (
          <textarea readOnly value={result.output} rows={4} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
        )}
      </div>
    </section>
  );
}
