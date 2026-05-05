"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "text -> markdown",
    input: "Plain text",
    output: "Markdown output",
    example:
      "Project launch notes\n\nKey updates:\n- faster indexing\n- better wallet UX\n- multilingual tools\n\nNext steps\nShip AI tools",
  },
  zh: {
    command: "text -> markdown",
    input: "纯文本",
    output: "Markdown 结果",
    example:
      "项目发布说明\n\n关键更新：\n- 更快的索引\n- 更好的钱包体验\n- 双语工具页\n\n下一步\n上线 AI 工具",
  },
} as const;

function toMarkdown(input: string) {
  const sections = input.replace(/\r\n/g, "\n").trim().split(/\n{2,}/);
  return sections
    .map((section, index) => {
      const lines = section.split("\n").map((line) => line.trim()).filter(Boolean);
      if (!lines.length) return "";
      if (lines.length === 1 && index === 0) return `# ${lines[0]}`;

      return lines
        .map((line, lineIndex) => {
          if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) return line;
          if (lineIndex === 0 && lines.length > 1) return `## ${line}`;
          return line;
        })
        .join("\n");
    })
    .filter(Boolean)
    .join("\n\n");
}

export default function TextToMarkdownTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);

  const output = useMemo(() => toMarkdown(input), [input]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/text-to-markdown</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="text-to-markdown-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="text-to-markdown-input" value={input} onChange={(event) => setInput(event.target.value)} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="text-to-markdown-output" className="block text-sm font-medium">{text.output}</label>
          <textarea id="text-to-markdown-output" readOnly value={output} rows={14} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
        </div>
      </div>
    </section>
  );
}
