"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "uuidgen",
    count: "Count",
    invalid: "Enter a number between 1 and 20.",
    output: "Generated UUIDs",
    regenerate: "regenerate",
  },
  zh: {
    command: "uuidgen",
    count: "数量",
    invalid: "请输入 1 到 20 之间的数字。",
    output: "生成结果",
    regenerate: "重新生成",
  },
} as const;

export default function UuidGeneratorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [countInput, setCountInput] = useState("5");
  const [seed, setSeed] = useState(0);

  const result = useMemo(() => {
    void seed;
    const count = Number(countInput);
    if (!Number.isInteger(count) || count < 1 || count > 20) {
      return { error: text.invalid };
    }

    return { uuids: Array.from({ length: count }, () => crypto.randomUUID()) };
  }, [countInput, seed, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/uuid-generator</span>
        <span>{text.command}</span>
      </div>
      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <label className="space-y-2 text-sm">
          <span className="block font-medium">{text.count}</span>
          <input value={countInput} onChange={(e) => setCountInput(e.target.value)} inputMode="numeric" className="w-32 rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]" />
        </label>
        <button type="button" onClick={() => setSeed((value) => value + 1)} className="rounded border border-[var(--terminal-border)] px-3 py-2 text-xs font-mono hover:border-[var(--terminal-accent)]">
          {text.regenerate}
        </button>
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="space-y-3 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.output}</div>
          <ul className="space-y-2">
            {result.uuids.map((uuid) => (
              <li key={uuid} className="rounded border border-[var(--terminal-border)] px-3 py-2 font-mono text-sm break-all">
                {uuid}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
