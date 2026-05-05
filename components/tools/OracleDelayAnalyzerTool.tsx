"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "analyze oracle delay",
    oracleTs: "Oracle timestamp (unix sec)",
    referenceTs: "Reference timestamp (unix sec)",
    heartbeat: "Expected heartbeat (sec)",
    delay: "Delay (sec)",
    minutes: "Delay (min)",
    heartbeats: "Heartbeats missed",
    status: "Status",
    invalid: "Enter non-negative timestamps and a positive heartbeat.",
    fresh: "Fresh",
    stale: "Stale",
    critical: "Critical",
  },
  zh: {
    command: "analyze oracle delay",
    oracleTs: "预言机时间戳（unix 秒）",
    referenceTs: "参考时间戳（unix 秒）",
    heartbeat: "预期 heartbeat（秒）",
    delay: "延迟（秒）",
    minutes: "延迟（分钟）",
    heartbeats: "错过 heartbeat 数",
    status: "状态",
    invalid: "请输入非负时间戳和正数 heartbeat。",
    fresh: "新鲜",
    stale: "偏旧",
    critical: "严重滞后",
  },
} as const;

export default function OracleDelayAnalyzerTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [oracleTs, setOracleTs] = useState<string>("1714900000");
  const [referenceTs, setReferenceTs] = useState<string>("1714900900");
  const [heartbeat, setHeartbeat] = useState<string>("300");

  const result = useMemo(() => {
    const oracle = Number.parseInt(oracleTs, 10);
    const reference = Number.parseInt(referenceTs, 10);
    const expected = Number.parseInt(heartbeat, 10);

    if (!Number.isFinite(oracle) || !Number.isFinite(reference) || !Number.isFinite(expected) || oracle < 0 || reference < 0 || expected <= 0) {
      return { error: text.invalid };
    }

    const delay = Math.max(reference - oracle, 0);
    const missed = Math.floor(delay / expected);
    const status = delay <= expected ? text.fresh : delay <= expected * 3 ? text.stale : text.critical;

    return {
      delay: delay.toString(),
      minutes: (delay / 60).toFixed(2),
      heartbeats: missed.toString(),
      status,
    };
  }, [heartbeat, oracleTs, referenceTs, text.critical, text.fresh, text.invalid, text.stale]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/oracle-delay-analyzer</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {([
          [text.oracleTs, oracleTs, setOracleTs],
          [text.referenceTs, referenceTs, setReferenceTs],
          [text.heartbeat, heartbeat, setHeartbeat],
        ] as const).map(([label, value, setter]) => (
          <label key={label} className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <span className="block text-sm font-medium">{label}</span>
            <input type="text" value={value} onChange={(event) => setter(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
          </label>
        ))}
      </div>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-4">
          {([
            [text.delay, result.delay],
            [text.minutes, result.minutes],
            [text.heartbeats, result.heartbeats],
            [text.status, result.status],
          ] as const).map(([label, value]) => (
            <div key={label} className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
              <div className="text-sm font-medium">{label}</div>
              <textarea readOnly value={value} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
