"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

type UnitMode = "metric" | "imperial";

const TEXT = {
  en: {
    command: "bmi = weight / height^2",
    unit: "Unit",
    metric: "Metric",
    imperial: "Imperial",
    weightKg: "Weight kg",
    heightCm: "Height cm",
    weightLb: "Weight lb",
    feet: "Feet",
    inches: "Inches",
    bmi: "BMI",
    category: "Category",
    healthyRange: "Normal weight range",
    note: "BMI is a quick screening metric, not a diagnosis. It does not measure body fat, muscle mass, or medical risk by itself.",
    invalid: "Enter valid positive height and weight values.",
    underweight: "Underweight",
    normal: "Normal",
    overweight: "Overweight",
    obese: "Obese",
  },
  zh: {
    command: "bmi = weight / height^2",
    unit: "单位",
    metric: "公制",
    imperial: "英制",
    weightKg: "体重 kg",
    heightCm: "身高 cm",
    weightLb: "体重 lb",
    feet: "英尺",
    inches: "英寸",
    bmi: "BMI",
    category: "分类",
    healthyRange: "正常 BMI 对应体重范围",
    note: "BMI 只是一个快速筛查指标，不等于医学诊断，也不能单独反映体脂、肌肉量或健康风险。",
    invalid: "请输入有效且大于 0 的身高和体重。",
    underweight: "偏瘦",
    normal: "正常",
    overweight: "超重",
    obese: "肥胖",
  },
} as const;

function classifyBmi(bmi: number, text: (typeof TEXT)["en"] | (typeof TEXT)["zh"]) {
  if (bmi < 18.5) return { label: text.underweight, tone: "text-sky-300" };
  if (bmi < 25) return { label: text.normal, tone: "text-[var(--terminal-accent)]" };
  if (bmi < 30) return { label: text.overweight, tone: "text-amber-300" };
  return { label: text.obese, tone: "text-red-300" };
}

function formatRange(min: number, max: number, unit: string) {
  return `${min.toFixed(1)} - ${max.toFixed(1)} ${unit}`;
}

export default function BmiCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [unit, setUnit] = useState<UnitMode>("metric");
  const [weightKg, setWeightKg] = useState("70");
  const [heightCm, setHeightCm] = useState("175");
  const [weightLb, setWeightLb] = useState("154");
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("9");

  const result = useMemo(() => {
    if (unit === "metric") {
      const weight = Number(weightKg || 0);
      const height = Number(heightCm || 0) / 100;
      if (![weight, height].every(Number.isFinite) || weight <= 0 || height <= 0) return { error: text.invalid };

      const bmi = weight / (height * height);
      const minWeight = 18.5 * height * height;
      const maxWeight = 24.9 * height * height;
      return {
        bmi,
        range: formatRange(minWeight, maxWeight, "kg"),
      };
    }

    const weight = Number(weightLb || 0);
    const heightInches = Number(feet || 0) * 12 + Number(inches || 0);
    if (![weight, heightInches].every(Number.isFinite) || weight <= 0 || heightInches <= 0) return { error: text.invalid };

    const bmi = (703 * weight) / (heightInches * heightInches);
    const minWeight = (18.5 * heightInches * heightInches) / 703;
    const maxWeight = (24.9 * heightInches * heightInches) / 703;
    return {
      bmi,
      range: formatRange(minWeight, maxWeight, "lb"),
    };
  }, [feet, heightCm, inches, text.invalid, unit, weightKg, weightLb]);

  const category = "error" in result ? null : classifyBmi(result.bmi, text);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/bmi-calculator</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm">
          <span className="block font-medium">{text.unit}</span>
          <select
            value={unit}
            onChange={(event) => setUnit(event.target.value as UnitMode)}
            className="w-full rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)] px-3 py-2 outline-none focus:border-[var(--terminal-accent)]"
          >
            <option value="metric">{text.metric}</option>
            <option value="imperial">{text.imperial}</option>
          </select>
        </label>

        {unit === "metric" ? (
          <>
            <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm">
              <span className="block font-medium">{text.weightKg}</span>
              <input
                value={weightKg}
                onChange={(event) => setWeightKg(event.target.value)}
                inputMode="decimal"
                className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]"
              />
            </label>
            <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm">
              <span className="block font-medium">{text.heightCm}</span>
              <input
                value={heightCm}
                onChange={(event) => setHeightCm(event.target.value)}
                inputMode="decimal"
                className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]"
              />
            </label>
          </>
        ) : (
          <>
            <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm">
              <span className="block font-medium">{text.weightLb}</span>
              <input
                value={weightLb}
                onChange={(event) => setWeightLb(event.target.value)}
                inputMode="decimal"
                className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm">
                <span className="block font-medium">{text.feet}</span>
                <input
                  value={feet}
                  onChange={(event) => setFeet(event.target.value)}
                  inputMode="decimal"
                  className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]"
                />
              </label>
              <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm">
                <span className="block font-medium">{text.inches}</span>
                <input
                  value={inches}
                  onChange={(event) => setInches(event.target.value)}
                  inputMode="decimal"
                  className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]"
                />
              </label>
            </div>
          </>
        )}
      </div>

      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded border border-[var(--terminal-border)] p-4">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.bmi}</div>
            <div className="mt-2 font-mono text-3xl text-[var(--terminal-accent)]">{result.bmi.toFixed(1)}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-4">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.category}</div>
            <div className={`mt-2 text-xl font-semibold ${category?.tone}`}>{category?.label}</div>
          </div>
          <div className="rounded border border-[var(--terminal-border)] p-4">
            <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.healthyRange}</div>
            <div className="mt-2 font-mono text-sm">{result.range}</div>
          </div>
        </div>
      )}

      <p className="rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 px-3 py-2 text-xs leading-5 text-[var(--terminal-muted)]">
        {text.note}
      </p>
    </section>
  );
}
