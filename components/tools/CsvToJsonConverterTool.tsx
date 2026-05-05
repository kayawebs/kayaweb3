"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const TEXT = {
  en: {
    command: "csv | jq",
    input: "CSV input",
    output: "JSON output",
    invalid: "Enter valid CSV with a header row.",
    inferTypes: "Infer booleans and numbers",
    example: "name,role,active\nKaya,dev,true\nMilo,writer,false",
  },
  zh: {
    command: "csv | jq",
    input: "CSV 输入",
    output: "JSON 输出",
    invalid: "请输入合法 CSV，并包含表头行。",
    inferTypes: "自动识别布尔值和数字",
    example: "name,role,active\nKaya,dev,true\nMilo,writer,false",
  },
} as const;

function parseCsv(input: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const next = input[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  if (inQuotes) {
    throw new Error("Unclosed quote");
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  return rows.filter((item) => item.some((cell) => cell.length > 0));
}

function inferValue(value: string) {
  const trimmed = value.trim();
  if (trimmed === "") return "";
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;
  const number = Number(trimmed);
  return Number.isFinite(number) && trimmed !== "" ? number : value;
}

export default function CsvToJsonConverterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState<string>(text.example);
  const [inferTypes, setInferTypes] = useState(true);

  const result = useMemo(() => {
    try {
      const rows = parseCsv(input);
      if (rows.length < 2) {
        return { error: text.invalid };
      }
      const headers = rows[0];
      if (headers.some((header) => !header.trim())) {
        return { error: text.invalid };
      }
      const data = rows.slice(1).map((row) =>
        Object.fromEntries(headers.map((header, index) => [header, inferTypes ? inferValue(row[index] ?? "") : row[index] ?? ""])),
      );

      return { output: JSON.stringify(data, null, 2) };
    } catch {
      return { error: text.invalid };
    }
  }, [inferTypes, input, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/csv-to-json-converter</span>
        <span>{text.command}</span>
      </div>
      <label className="flex items-center gap-2 rounded border border-[var(--terminal-border)] px-3 py-2 text-sm">
        <input type="checkbox" checked={inferTypes} onChange={(event) => setInferTypes(event.target.checked)} />
        <span>{text.inferTypes}</span>
      </label>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="csv-to-json-input" className="block text-sm font-medium">{text.input}</label>
          <textarea id="csv-to-json-input" value={input} onChange={(event) => setInput(event.target.value)} rows={16} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--terminal-accent)]" />
        </div>
        <div className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4">
          <label htmlFor="csv-to-json-output" className="block text-sm font-medium">{text.output}</label>
          {"error" in result ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
          ) : (
            <textarea id="csv-to-json-output" readOnly value={result.output} rows={16} className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 font-mono text-sm outline-none" />
          )}
        </div>
      </div>
    </section>
  );
}
