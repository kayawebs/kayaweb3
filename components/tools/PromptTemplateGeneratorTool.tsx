"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

type TemplateType = "writing" | "coding" | "research";

const TEXT = {
  en: {
    command: "generate prompt template",
    type: "Template type",
    topic: "Topic / task",
    audience: "Audience",
    constraints: "Constraints",
    output: "Prompt template",
    writing: "Writing",
    coding: "Coding",
    research: "Research",
  },
  zh: {
    command: "generate prompt template",
    type: "模板类型",
    topic: "主题 / 任务",
    audience: "受众",
    constraints: "约束条件",
    output: "Prompt 模板",
    writing: "写作",
    coding: "编码",
    research: "研究",
  },
} as const;

function buildTemplate(type: TemplateType, topic: string, audience: string, constraints: string) {
  const safeTopic = topic.trim() || "{{topic}}";
  const safeAudience = audience.trim() || "{{audience}}";
  const safeConstraints = constraints.trim() || "{{constraints}}";

  if (type === "coding") {
    return [
      `Task: ${safeTopic}`,
      `Audience: ${safeAudience}`,
      "Context:",
      "- You are helping with a coding-related task.",
      "- Prefer practical, correct, minimal solutions.",
      "Constraints:",
      `- ${safeConstraints}`,
      "Output format:",
      "- Explain the approach briefly.",
      "- Show the solution.",
      "- Mention edge cases or tradeoffs when relevant.",
    ].join("\n");
  }

  if (type === "research") {
    return [
      `Research goal: ${safeTopic}`,
      `Audience: ${safeAudience}`,
      "Requirements:",
      `- ${safeConstraints}`,
      "- Keep claims clear and well structured.",
      "- Separate findings from assumptions.",
      "Output format:",
      "- Summary",
      "- Key points",
      "- Risks / open questions",
    ].join("\n");
  }

  return [
    `Task: ${safeTopic}`,
    `Audience: ${safeAudience}`,
    "Style requirements:",
    `- ${safeConstraints}`,
    "- Keep the tone clear and direct.",
    "Output format:",
    "- Final version",
    "- Optional short notes if needed",
  ].join("\n");
}

export default function PromptTemplateGeneratorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [type, setType] = useState<TemplateType>("writing");
  const [topic, setTopic] = useState<string>("Announce a new Web3 tool collection");
  const [audience, setAudience] = useState<string>("Developers and technically curious users");
  const [constraints, setConstraints] = useState<string>("Be concise, concrete, and avoid fluff.");

  const output = useMemo(() => buildTemplate(type, topic, audience, constraints), [audience, constraints, topic, type]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/prompt-template-generator</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <label htmlFor="prompt-template-type" className="block text-sm font-medium">{text.type}</label>
            <select id="prompt-template-type" value={type} onChange={(event) => setType(event.target.value as TemplateType)} className="w-full rounded border border-[var(--terminal-border)] bg-[var(--background)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]">
              <option value="writing">{text.writing}</option>
              <option value="coding">{text.coding}</option>
              <option value="research">{text.research}</option>
            </select>
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <label htmlFor="prompt-template-topic" className="block text-sm font-medium">{text.topic}</label>
            <input id="prompt-template-topic" type="text" value={topic} onChange={(event) => setTopic(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]" />
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <label htmlFor="prompt-template-audience" className="block text-sm font-medium">{text.audience}</label>
            <input id="prompt-template-audience" type="text" value={audience} onChange={(event) => setAudience(event.target.value)} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]" />
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
            <label htmlFor="prompt-template-constraints" className="block text-sm font-medium">{text.constraints}</label>
            <textarea id="prompt-template-constraints" value={constraints} onChange={(event) => setConstraints(event.target.value)} rows={5} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--terminal-accent)]" />
          </div>
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <div className="text-sm font-medium">{text.output}</div>
          <textarea readOnly value={output} rows={18} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
        </div>
      </div>
    </section>
  );
}
