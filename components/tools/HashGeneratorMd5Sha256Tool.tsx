"use client";

import { useEffect, useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const encoder = new TextEncoder();

const TEXT = {
  en: {
    command: "shasum / md5",
    input: "Text input",
    md5: "MD5",
    sha256: "SHA-256",
    example: "kaya tools",
  },
  zh: {
    command: "shasum / md5",
    input: "文本输入",
    md5: "MD5",
    sha256: "SHA-256",
    example: "kaya tools",
  },
} as const;

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function md5(value: string) {
  const input = encoder.encode(value);
  const originalLength = input.length;
  const bitLength = originalLength * 8;
  const paddedLength = (((originalLength + 8) >> 6) + 1) * 64;
  const bytes = new Uint8Array(paddedLength);
  bytes.set(input);
  bytes[originalLength] = 0x80;

  const view = new DataView(bytes.buffer);
  view.setUint32(paddedLength - 8, bitLength >>> 0, true);
  view.setUint32(paddedLength - 4, Math.floor(bitLength / 0x100000000), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];

  const k = Array.from({ length: 64 }, (_, index) => Math.floor(Math.abs(Math.sin(index + 1)) * 0x100000000) >>> 0);

  for (let offset = 0; offset < bytes.length; offset += 64) {
    const chunk = new Uint32Array(16);
    for (let i = 0; i < 16; i += 1) {
      chunk[i] = view.getUint32(offset + i * 4, true);
    }

    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let i = 0; i < 64; i += 1) {
      let f: number;
      let g: number;

      if (i < 16) {
        f = (b & c) | (~b & d);
        g = i;
      } else if (i < 32) {
        f = (d & b) | (~d & c);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = b ^ c ^ d;
        g = (3 * i + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * i) % 16;
      }

      const temp = d;
      d = c;
      c = b;
      const sum = (a + f + k[i] + chunk[g]) >>> 0;
      b = (b + ((sum << s[i]) | (sum >>> (32 - s[i])))) >>> 0;
      a = temp;
    }

    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  const output = new Uint8Array(16);
  const outputView = new DataView(output.buffer);
  outputView.setUint32(0, a0, true);
  outputView.setUint32(4, b0, true);
  outputView.setUint32(8, c0, true);
  outputView.setUint32(12, d0, true);
  return toHex(output);
}

export default function HashGeneratorMd5Sha256Tool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);
  const [sha256, setSha256] = useState<string>("");

  const md5Value = useMemo(() => md5(input), [input]);

  useEffect(() => {
    let disposed = false;

    crypto.subtle.digest("SHA-256", encoder.encode(input)).then((buffer) => {
      if (!disposed) {
        setSha256(toHex(new Uint8Array(buffer)));
      }
    });

    return () => {
      disposed = true;
    };
  }, [input]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/hash-generator-md5-sha256</span>
        <span>{text.command}</span>
      </div>
      <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <label htmlFor="hash-generator-input" className="block text-sm font-medium">{text.input}</label>
        <textarea id="hash-generator-input" value={input} onChange={(event) => setInput(event.target.value)} rows={8} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="hash-generator-md5" className="block text-sm font-medium">{text.md5}</label>
          <textarea id="hash-generator-md5" readOnly value={md5Value} rows={5} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="hash-generator-sha256" className="block text-sm font-medium">{text.sha256}</label>
          <textarea id="hash-generator-sha256" readOnly value={sha256} rows={5} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
        </div>
      </div>
    </section>
  );
}
