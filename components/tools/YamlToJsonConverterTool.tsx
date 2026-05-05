"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "yaml | jq",
    input: "YAML input",
    output: "JSON output",
    invalid: "Enter valid YAML using spaces for indentation.",
    example: `user:
  name: Kaya
  active: true
  roles:
    - dev
    - writer`,
  },
  zh: {
    command: "yaml | jq",
    input: "YAML 输入",
    output: "JSON 输出",
    invalid: "请输入合法 YAML，并使用空格缩进。",
    example: `user:
  name: Kaya
  active: true
  roles:
    - dev
    - writer`,
  },
} as const;

function parseYamlScalar(value: string): unknown {
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null" || trimmed === "~") return null;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

type YamlLine = { indent: number; text: string };

function preprocessYaml(input: string): YamlLine[] {
  return input
    .split(/\r?\n/)
    .map((line) => ({ raw: line, trimmed: line.trim() }))
    .filter(({ trimmed }) => trimmed.length > 0 && !trimmed.startsWith("#"))
    .map(({ raw, trimmed }) => ({ indent: raw.length - raw.trimStart().length, text: trimmed }));
}

function parseYamlBlock(lines: YamlLine[], startIndex: number, indent: number): { value: unknown; nextIndex: number } {
  const current = lines[startIndex];
  if (!current || current.indent < indent) {
    return { value: {}, nextIndex: startIndex };
  }

  if (current.text.startsWith("- ")) {
    const items: unknown[] = [];
    let index = startIndex;

    while (index < lines.length) {
      const line = lines[index];
      if (line.indent < indent) break;
      if (line.indent !== indent || !line.text.startsWith("- ")) {
        throw new Error("Invalid YAML array indentation");
      }

      const content = line.text.slice(2).trim();
      if (content === "") {
        const nested = parseYamlBlock(lines, index + 1, indent + 2);
        items.push(nested.value);
        index = nested.nextIndex;
        continue;
      }

      const pair = content.match(/^([^:]+):\s*(.*)$/);
      if (pair) {
        const [, rawKey, rawRest] = pair;
        const item: Record<string, unknown> = { [rawKey.trim()]: rawRest ? parseYamlScalar(rawRest) : {} };
        index += 1;
        if (!rawRest && index < lines.length && lines[index].indent > indent) {
          const nested = parseYamlBlock(lines, index, indent + 4);
          item[rawKey.trim()] = nested.value;
          index = nested.nextIndex;
        }
        while (index < lines.length && lines[index].indent === indent + 2 && !lines[index].text.startsWith("- ")) {
          const nestedPair = lines[index].text.match(/^([^:]+):\s*(.*)$/);
          if (!nestedPair) throw new Error("Invalid YAML object entry");
          const [, nestedKey, nestedRest] = nestedPair;
          if (nestedRest) {
            item[nestedKey.trim()] = parseYamlScalar(nestedRest);
            index += 1;
          } else {
            const nested = parseYamlBlock(lines, index + 1, indent + 4);
            item[nestedKey.trim()] = nested.value;
            index = nested.nextIndex;
          }
        }
        items.push(item);
        continue;
      }

      items.push(parseYamlScalar(content));
      index += 1;
    }

    return { value: items, nextIndex: index };
  }

  const object: Record<string, unknown> = {};
  let index = startIndex;

  while (index < lines.length) {
    const line = lines[index];
    if (line.indent < indent) break;
    if (line.indent !== indent || line.text.startsWith("- ")) break;

    const pair = line.text.match(/^([^:]+):\s*(.*)$/);
    if (!pair) {
      throw new Error("Invalid YAML object entry");
    }

    const [, rawKey, rawRest] = pair;
    const key = rawKey.trim();
    if (rawRest) {
      object[key] = parseYamlScalar(rawRest);
      index += 1;
      continue;
    }

    const nested = parseYamlBlock(lines, index + 1, indent + 2);
    object[key] = nested.value;
    index = nested.nextIndex;
  }

  return { value: object, nextIndex: index };
}

export default function YamlToJsonConverterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);

  const result = useMemo(() => {
    try {
      const lines = preprocessYaml(input);
      if (lines.length === 0) {
        return { error: text.invalid };
      }
      const parsed = parseYamlBlock(lines, 0, lines[0].indent).value;
      return { output: JSON.stringify(parsed, null, 2) };
    } catch {
      return { error: text.invalid };
    }
  }, [input, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/yaml-to-json-converter</span>
        <span>{text.command}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="yaml-to-json-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="yaml-to-json-input" value={input} onChange={(event) => setInput(event.target.value)} rows={16} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="yaml-to-json-output" className="block text-sm font-medium">{text.output}</label>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <textarea id="yaml-to-json-output" readOnly value={result.output} rows={16} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
