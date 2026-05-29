"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const DIGITS = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"] as const;
const SMALL_UNITS = ["", "拾", "佰", "仟"] as const;
const SECTION_UNITS = ["", "万", "亿", "兆"] as const;
const ZERO = BigInt(0);
const ONE = BigInt(1);
const TEN = BigInt(10);
const HUNDRED = BigInt(100);
const MAX_INTEGER = BigInt("9999999999999999");

const TEXT = {
  en: {
    command: "amount --to-rmb-uppercase",
    label: "Amount",
    placeholder: "1234.56",
    copy: "Copy",
    copied: "Copied",
    output: "Chinese uppercase amount",
    normalized: "Normalized amount",
    note: "Amounts with more than two decimals are rounded to the nearest fen.",
    examples: "Examples",
    errorEmpty: "Enter an amount to convert.",
    errorInvalid: "Use a plain number such as 1234.56. Currency symbols and commas are optional.",
    errorTooLarge: "The integer part is too large. Use an amount below 10,000,000,000,000,000.",
  },
  zh: {
    command: "amount --to-rmb-uppercase",
    label: "金额",
    placeholder: "1234.56",
    copy: "复制",
    copied: "已复制",
    output: "人民币金额大写",
    normalized: "标准金额",
    note: "超过两位小数时，会按分进行四舍五入。",
    examples: "示例",
    errorEmpty: "请输入需要转换的金额。",
    errorInvalid: "请输入普通数字，例如 1234.56。可以带货币符号和逗号。",
    errorTooLarge: "整数部分过大，请输入小于 10,000,000,000,000,000 的金额。",
  },
} as const;

type ConversionResult =
  | {
      ok: true;
      output: string;
      normalized: string;
      rounded: boolean;
    }
  | {
      ok: false;
      error: string;
    };

function sectionToChinese(section: string) {
  const padded = section.padStart(4, "0");
  let result = "";
  let pendingZero = false;

  padded.split("").forEach((char, index) => {
    const digit = Number(char);
    const unitIndex = 3 - index;

    if (digit === 0) {
      if (result) {
        pendingZero = true;
      }
      return;
    }

    if (pendingZero) {
      result += DIGITS[0];
      pendingZero = false;
    }
    result += `${DIGITS[digit]}${SMALL_UNITS[unitIndex]}`;
  });

  return result;
}

function integerToChinese(integerText: string) {
  const normalized = integerText.replace(/^0+/, "") || "0";
  if (normalized === "0") return DIGITS[0];

  const sections: string[] = [];
  for (let end = normalized.length; end > 0; end -= 4) {
    sections.unshift(normalized.slice(Math.max(0, end - 4), end));
  }

  let result = "";
  let skippedZeroSection = false;

  sections.forEach((section, index) => {
    const sectionValue = Number(section);
    const unit = SECTION_UNITS[sections.length - index - 1];

    if (sectionValue === 0) {
      skippedZeroSection = result.length > 0;
      return;
    }

    if (result && (skippedZeroSection || sectionValue < 1000)) {
      result += DIGITS[0];
    }

    result += `${sectionToChinese(section)}${unit}`;
    skippedZeroSection = false;
  });

  return result;
}

function normalizeRawAmount(input: string) {
  return input
    .trim()
    .replace(/rmb/gi, "")
    .replace(/[,\s¥￥元]/g, "");
}

function convertToRmbUppercase(input: string, locale: ToolLocale): ConversionResult {
  const text = TEXT[locale];
  const normalizedInput = normalizeRawAmount(input);

  if (!normalizedInput) {
    return { ok: false, error: text.errorEmpty };
  }

  if (!/^\d*(?:\.\d*)?$/.test(normalizedInput) || normalizedInput === ".") {
    return { ok: false, error: text.errorInvalid };
  }

  const [rawInteger = "0", rawDecimal = ""] = normalizedInput.split(".");
  const integerPart = rawInteger.replace(/^0+/, "") || "0";

  if (BigInt(integerPart) > MAX_INTEGER) {
    return { ok: false, error: text.errorTooLarge };
  }

  const rounded = rawDecimal.length > 2;
  const centsText = rawDecimal.padEnd(3, "0");
  let totalCents = BigInt(integerPart) * HUNDRED + BigInt(centsText.slice(0, 2));
  if (Number(centsText[2]) >= 5) {
    totalCents += ONE;
  }

  const finalInteger = totalCents / HUNDRED;
  if (finalInteger > MAX_INTEGER) {
    return { ok: false, error: text.errorTooLarge };
  }

  const jiao = Number((totalCents / TEN) % TEN);
  const fen = Number(totalCents % TEN);
  const integerChinese = integerToChinese(finalInteger.toString());
  const integerWithCommas = finalInteger.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const normalized = `¥${integerWithCommas}.${String(jiao)}${String(fen)}`;

  if (totalCents === ZERO) {
    return { ok: true, output: "人民币零元整", normalized, rounded };
  }

  let output = "人民币";
  if (finalInteger > ZERO) {
    output += `${integerChinese}元`;
  }

  if (jiao === 0 && fen === 0) {
    output += "整";
  } else {
    if (jiao > 0) {
      output += `${DIGITS[jiao]}角`;
    }
    if (fen > 0) {
      output += `${finalInteger > ZERO && jiao === 0 ? DIGITS[0] : ""}${DIGITS[fen]}分`;
    } else if (jiao > 0) {
      output += "整";
    }
  }

  return { ok: true, output, normalized, rounded };
}

const EXAMPLES = ["1234.56", "1001", "100000001.23", "0.05", "1.01", "¥98,765.432"];

export default function RmbUppercaseConverterTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [input, setInput] = useState("1234.56");
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => convertToRmbUppercase(input, locale), [input, locale]);

  const copyOutput = async () => {
    if (!result.ok) return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/rmb-uppercase-converter</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <label className="space-y-2">
          <span className="text-sm font-medium">{text.label}</span>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={text.placeholder}
            inputMode="decimal"
            className="w-full rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 px-4 py-3 font-mono text-lg outline-none focus:border-[var(--terminal-accent)]"
          />
        </label>

        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">{text.output}</span>
            <button
              type="button"
              onClick={copyOutput}
              disabled={!result.ok}
              className="rounded border border-[var(--terminal-border)] px-3 py-1.5 text-xs font-mono text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50 hover:border-[var(--terminal-accent)]"
            >
              {copied ? text.copied : text.copy}
            </button>
          </div>
          <output className="mt-4 block min-h-16 break-words font-mono text-xl leading-8 text-[var(--terminal-accent)]">
            {result.ok ? result.output : result.error}
          </output>
          {result.ok ? (
            <div className="mt-4 rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/35 px-3 py-2 text-xs font-mono text-[var(--terminal-muted)]">
              {text.normalized}: {result.normalized}
              {result.rounded ? ` · ${text.note}` : ""}
            </div>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">{text.examples}</div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setInput(example)}
              className="rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 px-3 py-2 font-mono text-xs text-[var(--terminal-muted)] transition-colors hover:border-[var(--terminal-accent)] hover:text-[var(--foreground)]"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
