"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "jwt.io",
    input: "JWT input",
    header: "Header",
    payload: "Payload",
    meta: "Token metadata",
    invalid: "Enter a valid JWT with header.payload.signature format.",
    algorithm: "Algorithm",
    issuedAt: "Issued at",
    expiresAt: "Expires at",
    notBefore: "Not before",
    signature: "Signature length",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IktheWEiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.c2lnbmF0dXJl",
  },
  zh: {
    command: "jwt.io",
    input: "JWT 输入",
    header: "Header",
    payload: "Payload",
    meta: "Token 信息",
    invalid: "请输入合法的 JWT，格式需要为 header.payload.signature。",
    algorithm: "算法",
    issuedAt: "签发时间",
    expiresAt: "过期时间",
    notBefore: "生效时间",
    signature: "签名长度",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IktheWEiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.c2lnbmF0dXJl",
  },
} as const;

function base64UrlDecode(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  return decodeURIComponent(
    Array.from(atob(`${normalized}${padding}`), (char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`).join(""),
  );
}

function formatUnixTime(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "n/a";
  return new Date(value * 1000).toISOString();
}

export default function JwtDecoderTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);

  const result = useMemo(() => {
    const parts = input.trim().split(".");
    if (parts.length < 2 || parts.length > 3) {
      return { error: text.invalid };
    }

    try {
      const header = JSON.parse(base64UrlDecode(parts[0])) as Record<string, unknown>;
      const payload = JSON.parse(base64UrlDecode(parts[1])) as Record<string, unknown>;

      return {
        header: JSON.stringify(header, null, 2),
        payload: JSON.stringify(payload, null, 2),
        meta: [
          [text.algorithm, String(header.alg ?? "n/a")],
          [text.issuedAt, formatUnixTime(payload.iat)],
          [text.expiresAt, formatUnixTime(payload.exp)],
          [text.notBefore, formatUnixTime(payload.nbf)],
          [text.signature, parts[2]?.length ? `${parts[2].length} chars` : "none"],
        ],
      };
    } catch {
      return { error: text.invalid };
    }
  }, [input, text.algorithm, text.expiresAt, text.invalid, text.issuedAt, text.notBefore, text.signature]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/jwt-decoder</span>
        <span>{text.command}</span>
      </div>
      <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <label htmlFor="jwt-decoder-input" className="block text-sm font-medium">{text.input}</label>
        <textarea id="jwt-decoder-input" value={input} onChange={(event) => setInput(event.target.value)} rows={8} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
              <label htmlFor="jwt-decoder-header" className="block text-sm font-medium">{text.header}</label>
              <textarea id="jwt-decoder-header" readOnly value={result.header} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
            </div>
            <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
              <label htmlFor="jwt-decoder-payload" className="block text-sm font-medium">{text.payload}</label>
              <textarea id="jwt-decoder-payload" readOnly value={result.payload} rows={12} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
            </div>
          </div>
          <div className="space-y-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.meta}</div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {result.meta.map(([label, value]) => (
                <div key={label} className="rounded border border-[var(--terminal-border)] p-3">
                  <div className="text-xs font-mono text-[var(--terminal-muted)]">{label}</div>
                  <div className="mt-1 break-all font-mono text-sm">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
