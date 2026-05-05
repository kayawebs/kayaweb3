"use client";

import { useMemo, useState } from "react";

import { Interface } from "ethers";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "Interface.parseLog",
    fragment: "Event fragment",
    topics: "Topics (one per line)",
    data: "Data",
    output: "Decoded event log",
    invalid: "Enter a valid event fragment, topics, and data.",
    exampleFragment: "event Transfer(address indexed from, address indexed to, uint256 value)",
    exampleTopics:
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef\n0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045\n0x000000000000000000000000111111111117dc0aa78b770fa6a738034120c302",
    exampleData: "0x00000000000000000000000000000000000000000000000000000000000003e8",
  },
  zh: {
    command: "Interface.parseLog",
    fragment: "事件片段",
    topics: "Topics（每行一个）",
    data: "Data",
    output: "事件日志解码结果",
    invalid: "请输入合法的事件片段、topics 和 data。",
    exampleFragment: "event Transfer(address indexed from, address indexed to, uint256 value)",
    exampleTopics:
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef\n0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045\n0x000000000000000000000000111111111117dc0aa78b770fa6a738034120c302",
    exampleData: "0x00000000000000000000000000000000000000000000000000000000000003e8",
  },
} as const;

function safeSerialize(value: unknown) {
  return JSON.stringify(
    value,
    (_, current) => (typeof current === "bigint" ? current.toString() : current),
    2,
  );
}

export default function EventLogDecoderTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [fragment, setFragment] = useState<string>(text.exampleFragment);
  const [topicsInput, setTopicsInput] = useState<string>(text.exampleTopics);
  const [data, setData] = useState<string>(text.exampleData);

  const result = useMemo(() => {
    try {
      const topics = topicsInput.split("\n").map((item) => item.trim()).filter(Boolean);
      const iface = new Interface([fragment]);
      const parsed = iface.parseLog({ topics, data: data.trim() });
      if (!parsed) {
        return { error: text.invalid };
      }
      return {
        output: safeSerialize({
          name: parsed.name,
          signature: parsed.signature,
          topic: parsed.topic,
          args: parsed.args.toArray(true),
        }),
      };
    } catch {
      return { error: text.invalid };
    }
  }, [data, fragment, text.invalid, topicsInput]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/event-log-decoder</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <label htmlFor="event-log-fragment" className="block text-sm font-medium">{text.fragment}</label>
            <textarea id="event-log-fragment" value={fragment} onChange={(event) => setFragment(event.target.value)} rows={4} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <label htmlFor="event-log-topics" className="block text-sm font-medium">{text.topics}</label>
            <textarea id="event-log-topics" value={topicsInput} onChange={(event) => setTopicsInput(event.target.value)} rows={6} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <label htmlFor="event-log-data" className="block text-sm font-medium">{text.data}</label>
            <textarea id="event-log-data" value={data} onChange={(event) => setData(event.target.value)} rows={4} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
          </div>
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.output}</div>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <textarea readOnly value={result.output} rows={16} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
