"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Algo = "bubble" | "insertion";

type Step = {
  arr: number[];
  i?: number;
  j?: number;
  swapped?: boolean;
};

function genBubbleSteps(input: number[]): Step[] {
  const a = input.slice();
  const steps: Step[] = [{ arr: a.slice() }];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ arr: a.slice(), i: j, j: j + 1 });
      if (a[j] > a[j + 1]) {
        const t = a[j];
        a[j] = a[j + 1];
        a[j + 1] = t;
        steps.push({ arr: a.slice(), i: j, j: j + 1, swapped: true });
      }
    }
  }
  return steps;
}

function genInsertionSteps(input: number[]): Step[] {
  const a = input.slice();
  const steps: Step[] = [{ arr: a.slice() }];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      steps.push({ arr: a.slice(), i: j, j: j + 1 });
      a[j + 1] = a[j];
      steps.push({ arr: a.slice(), i: j, j: j + 1, swapped: true });
      j--;
    }
    a[j + 1] = key;
    steps.push({ arr: a.slice(), i: j + 1 });
  }
  return steps;
}

function generate(algorithm: Algo, values: number[]): Step[] {
  switch (algorithm) {
    case "insertion":
      return genInsertionSteps(values);
    case "bubble":
    default:
      return genBubbleSteps(values);
  }
}

export default function SortVisualizer({
  algorithm = "bubble",
  values = [5, 3, 8, 4, 2, 7, 1, 6],
  speed = 400,
}: {
  algorithm?: Algo;
  values?: number[];
  speed?: number; // ms per step
}) {
  const steps = useMemo(() => generate(algorithm, values), [algorithm, values]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    timerRef.current = window.setInterval(() => {
      setIdx((i) => (i + 1 < steps.length ? i + 1 : 0));
    }, Math.max(60, speed));
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [playing, speed, steps.length]);

  const s = steps[idx] ?? steps[0];
  const max = Math.max(...values, 1);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-xs font-mono text-[var(--terminal-muted)]">
        <span>algorithm: {algorithm}</span>
        <span>step: {idx + 1}/{steps.length}</span>
        <button
          className="rounded border border-[var(--terminal-border)] px-2 py-1 text-[var(--foreground)]"
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? "pause" : "play"}
        </button>
      </div>
      <div className="flex h-40 items-end gap-1 rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)] p-2">
        {s.arr.map((v, i) => {
          const h = Math.max(6, Math.round((v / max) * 100));
          const active = i === s.i || i === s.j;
          const color = active ? (s.swapped ? "#ef4444" : "#22c55e") : "#6b7280";
          return (
            <div key={i} className="flex-1">
              <div
                style={{
                  height: `${h}%`,
                  backgroundColor: color,
                  transition: "height 200ms ease, background-color 200ms ease",
                }}
                className="w-full rounded-t"
                title={`${v}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

