"use client";

import { useMemo, useState } from "react";

import { getAddress, isAddress, verifyMessage } from "ethers";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "verifyMessage",
    message: "Message",
    signature: "Signature",
    expected: "Expected address",
    recovered: "Recovered address",
    status: "Verification result",
    invalidSignature: "Enter a valid message signature and expected address.",
    valid: "Signature matches the expected address.",
    invalid: "Signature does not match the expected address.",
    exampleMessage: "hello web3",
    exampleSignature:
      "0x1476abb7400f554d17aa1f8f4fd95c20d30c0a4f719216a4ac645b3b1f97b20c4a95cf8ed62f8676b29d2fcbf9fba1c6f484df5d5f604fa6cf64de31ee26d27f1b",
    exampleAddress: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  },
  zh: {
    command: "verifyMessage",
    message: "消息内容",
    signature: "签名",
    expected: "预期地址",
    recovered: "恢复出的地址",
    status: "验证结果",
    invalidSignature: "请输入有效的消息签名和预期地址。",
    valid: "签名与预期地址匹配。",
    invalid: "签名与预期地址不匹配。",
    exampleMessage: "hello web3",
    exampleSignature:
      "0x1476abb7400f554d17aa1f8f4fd95c20d30c0a4f719216a4ac645b3b1f97b20c4a95cf8ed62f8676b29d2fcbf9fba1c6f484df5d5f604fa6cf64de31ee26d27f1b",
    exampleAddress: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  },
} as const;

export default function SignatureVerifierTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [message, setMessage] = useState<string>(text.exampleMessage);
  const [signature, setSignature] = useState<string>(text.exampleSignature);
  const [expected, setExpected] = useState<string>(text.exampleAddress);

  const result = useMemo(() => {
    if (!isAddress(expected.trim())) {
      return { error: text.invalidSignature };
    }

    try {
      const recovered = getAddress(verifyMessage(message, signature.trim()));
      const normalizedExpected = getAddress(expected.trim());
      return {
        recovered,
        ok: recovered === normalizedExpected,
      };
    } catch {
      return { error: text.invalidSignature };
    }
  }, [expected, message, signature, text.invalidSignature]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/signature-verifier</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="signature-verifier-message" className="block text-sm font-medium">{text.message}</label>
          <textarea id="signature-verifier-message" value={message} onChange={(event) => setMessage(event.target.value)} rows={4} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="signature-verifier-signature" className="block text-sm font-medium">{text.signature}</label>
          <textarea id="signature-verifier-signature" value={signature} onChange={(event) => setSignature(event.target.value)} rows={5} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="signature-verifier-expected" className="block text-sm font-medium">{text.expected}</label>
          <input id="signature-verifier-expected" type="text" value={expected} onChange={(event) => setExpected(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.status}</div>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <p className={`rounded border px-3 py-2 text-sm ${result.ok ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200" : "border-rose-500/40 bg-rose-500/10 text-rose-200"}`}>
              {result.ok ? text.valid : text.invalid}
            </p>
          )}
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.recovered}</div>
          <textarea readOnly value={"recovered" in result ? result.recovered : ""} rows={4} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
        </div>
      </div>
    </section>
  );
}
