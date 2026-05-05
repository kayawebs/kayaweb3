"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "inspect fx history",
    series: "History lines (date,rate)",
    seriesHint: "Example: 2024-01-01,1.08\n2024-02-01,1.07\n2024-03-01,1.10",
    latest: "Latest rate",
    average: "Average rate",
    highest: "Highest rate",
    lowest: "Lowest rate",
    change: "First to last change",
    invalid: "Enter at least two valid lines in date,rate format with positive rates.",
  },
  zh: {
    command: "inspect fx history",
    series: "历史汇率（每行：日期,汇率）",
    seriesHint: "示例：2024-01-01,1.08\n2024-02-01,1.07\n2024-03-01,1.10",
    latest: "最新汇率",
    average: "平均汇率",
    highest: "最高汇率",
    lowest: "最低汇率",
    change: "首尾变化",
    invalid: "请至少输入两行合法的 日期,汇率，且汇率必须为正数。",
  },
} as const;

function format(value: number, digits = 6) {
  return value.toFixed(digits).replace(/\.?0+$/, "");
}

function parseSeries(input: string) {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [date, rateRaw] = line.split(",").map((part) => part.trim());
      const rate = Number.parseFloat(rateRaw ?? "");
      return { date, rate };
    })
    .filter(({ date, rate }) => Boolean(date) && Number.isFinite(rate) && rate > 0);
}

export default function ExchangeRateHistoryViewerTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [series, setSeries] = useState("2024-01-01,1.08\n2024-02-01,1.07\n2024-03-01,1.10\n2024-04-01,1.11");

  const result = useMemo(() => {
    const points = parseSeries(series);
    if (points.length < 2) {
      return { error: text.invalid };
    }

    const rates = points.map((point) => point.rate);
    const first = points[0];
    const last = points[points.length - 1];
    const highest = points.reduce((best, point) => (point.rate > best.rate ? point : best), points[0]);
    const lowest = points.reduce((best, point) => (point.rate < best.rate ? point : best), points[0]);
    const average = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
    const changePct = ((last.rate - first.rate) / first.rate) * 100;

    return {
      points,
      latest: `${last.date} | ${format(last.rate)}`,
      average: format(average),
      highest: `${highest.date} | ${format(highest.rate)}`,
      lowest: `${lowest.date} | ${format(lowest.rate)}`,
      change: `${format(changePct, 2)}%`,
    };
  }, [series, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/exchange-rate-history-viewer</span>
        <span>{text.command}</span>
      </div>
      <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
        <span className="block text-sm font-medium">{text.series}</span>
        <textarea
          value={series}
          onChange={(event) => setSeries(event.target.value)}
          rows={10}
          placeholder={text.seriesHint}
          className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]"
        />
      </label>
      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-5">
            {([
              [text.latest, result.latest],
              [text.average, result.average],
              [text.highest, result.highest],
              [text.lowest, result.lowest],
              [text.change, result.change],
            ] as const).map(([label, value]) => (
              <div key={label} className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
                <div className="text-sm font-medium">{label}</div>
                <textarea readOnly value={value} rows={3} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
              </div>
            ))}
          </div>
          <div className="overflow-x-auto rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30">
            <table className="min-w-full border-collapse text-sm">
              <thead className="font-mono text-xs text-[var(--terminal-muted)]">
                <tr>
                  <th className="border-b border-[var(--terminal-border)] px-4 py-3 text-left">date</th>
                  <th className="border-b border-[var(--terminal-border)] px-4 py-3 text-left">rate</th>
                </tr>
              </thead>
              <tbody>
                {result.points.map((point) => (
                  <tr key={`${point.date}-${point.rate}`}>
                    <td className="border-b border-[var(--terminal-border)]/60 px-4 py-3 font-mono">{point.date}</td>
                    <td className="border-b border-[var(--terminal-border)]/60 px-4 py-3 font-mono">{format(point.rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
