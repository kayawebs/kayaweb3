"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "xml | jq",
    input: "XML input",
    output: "JSON output",
    invalid: "Enter valid XML to convert.",
    example: `<root>
  <user id="1">
    <name>Kaya</name>
    <role>dev</role>
  </user>
</root>`,
  },
  zh: {
    command: "xml | jq",
    input: "XML 输入",
    output: "JSON 输出",
    invalid: "请输入合法 XML 后再转换。",
    example: `<root>
  <user id="1">
    <name>Kaya</name>
    <role>dev</role>
  </user>
</root>`,
  },
} as const;

function xmlNodeToJson(node: Element): unknown {
  const attributes = Array.from(node.attributes);
  const childElements = Array.from(node.children);
  const textNodes = Array.from(node.childNodes)
    .filter((child) => child.nodeType === Node.TEXT_NODE)
    .map((child) => child.textContent?.trim() ?? "")
    .filter(Boolean);

  if (attributes.length === 0 && childElements.length === 0) {
    return textNodes[0] ?? "";
  }

  const result: Record<string, unknown> = {};

  if (attributes.length > 0) {
    result["@attributes"] = Object.fromEntries(attributes.map((attribute) => [attribute.name, attribute.value]));
  }

  if (textNodes.length > 0) {
    result["#text"] = textNodes.join(" ");
  }

  childElements.forEach((child) => {
    const nextValue = xmlNodeToJson(child);
    const existing = result[child.tagName];
    if (existing === undefined) {
      result[child.tagName] = nextValue;
    } else if (Array.isArray(existing)) {
      existing.push(nextValue);
    } else {
      result[child.tagName] = [existing, nextValue];
    }
  });

  return result;
}

export default function XmlToJsonConverterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);

  const result = useMemo(() => {
    try {
      const parser = new DOMParser();
      const document = parser.parseFromString(input, "application/xml");
      if (document.querySelector("parsererror")) {
        return { error: text.invalid };
      }
      const root = document.documentElement;
      return { output: JSON.stringify({ [root.tagName]: xmlNodeToJson(root) }, null, 2) };
    } catch {
      return { error: text.invalid };
    }
  }, [input, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/xml-to-json-converter</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="xml-to-json-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="xml-to-json-input" value={input} onChange={(event) => setInput(event.target.value)} rows={16} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="xml-to-json-output" className="block text-sm font-medium">{text.output}</label>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <textarea id="xml-to-json-output" readOnly value={result.output} rows={16} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
