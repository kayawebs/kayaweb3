"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Algo =
  | "bubble"
  | "quick"
  | "insertion"
  | "selection"
  | "shell"
  | "merge"
  | "heap"
  | "counting"
  | "bucket"
  | "radix"
  | "bogo";

type Step = {
  arr: number[];
  i?: number;
  j?: number;
  swapped?: boolean;
};

function pushStep(steps: Step[], arr: number[], i?: number, j?: number, swapped?: boolean, maxSteps = 600) {
  if (steps.length >= maxSteps) return false;
  steps.push({ arr: arr.slice(), i, j, swapped });
  return true;
}

function isSorted(arr: number[]) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1] > arr[i]) return false;
  }
  return true;
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function makeValues(size: number, seed: number) {
  const arr = Array.from({ length: Math.max(2, size) }, (_, i) => i + 1);
  const rand = mulberry32(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr;
}

function genBubbleSteps(input: number[], maxSteps: number): Step[] {
  const a = input.slice();
  const steps: Step[] = [{ arr: a.slice() }];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (!pushStep(steps, a, j, j + 1, false, maxSteps)) return steps;
      if (a[j] > a[j + 1]) {
        const t = a[j];
        a[j] = a[j + 1];
        a[j + 1] = t;
        if (!pushStep(steps, a, j, j + 1, true, maxSteps)) return steps;
      }
    }
  }
  return steps;
}

function genInsertionSteps(input: number[], maxSteps: number): Step[] {
  const a = input.slice();
  const steps: Step[] = [{ arr: a.slice() }];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      if (!pushStep(steps, a, j, j + 1, false, maxSteps)) return steps;
      a[j + 1] = a[j];
      if (!pushStep(steps, a, j, j + 1, true, maxSteps)) return steps;
      j--;
    }
    a[j + 1] = key;
    if (!pushStep(steps, a, j + 1, undefined, false, maxSteps)) return steps;
  }
  return steps;
}

function genSelectionSteps(input: number[], maxSteps: number): Step[] {
  const a = input.slice();
  const steps: Step[] = [{ arr: a.slice() }];
  for (let i = 0; i < a.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) {
      if (!pushStep(steps, a, min, j, false, maxSteps)) return steps;
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) {
      const t = a[i];
      a[i] = a[min];
      a[min] = t;
      if (!pushStep(steps, a, i, min, true, maxSteps)) return steps;
    }
  }
  return steps;
}

function genShellSteps(input: number[], maxSteps: number): Step[] {
  const a = input.slice();
  const steps: Step[] = [{ arr: a.slice() }];
  for (let gap = Math.floor(a.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < a.length; i++) {
      const temp = a[i];
      let j = i;
      while (j >= gap && a[j - gap] > temp) {
        if (!pushStep(steps, a, j - gap, j, false, maxSteps)) return steps;
        a[j] = a[j - gap];
        if (!pushStep(steps, a, j - gap, j, true, maxSteps)) return steps;
        j -= gap;
      }
      a[j] = temp;
      if (!pushStep(steps, a, j, undefined, false, maxSteps)) return steps;
    }
  }
  return steps;
}

function genQuickSteps(input: number[], maxSteps: number): Step[] {
  const a = input.slice();
  const steps: Step[] = [{ arr: a.slice() }];
  function partition(l: number, r: number) {
    const pivot = a[r];
    let i = l;
    for (let j = l; j < r; j++) {
      if (!pushStep(steps, a, j, r, false, maxSteps)) return l;
      if (a[j] < pivot) {
        const t = a[i];
        a[i] = a[j];
        a[j] = t;
        if (!pushStep(steps, a, i, j, true, maxSteps)) return i;
        i++;
      }
    }
    const t = a[i];
    a[i] = a[r];
    a[r] = t;
    pushStep(steps, a, i, r, true, maxSteps);
    return i;
  }
  function sort(l: number, r: number) {
    if (l >= r || steps.length >= maxSteps) return;
    const p = partition(l, r);
    sort(l, p - 1);
    sort(p + 1, r);
  }
  sort(0, a.length - 1);
  return steps;
}

function genMergeSteps(input: number[], maxSteps: number): Step[] {
  const a = input.slice();
  const steps: Step[] = [{ arr: a.slice() }];
  const aux = a.slice();
  function merge(l: number, m: number, r: number) {
    for (let k = l; k <= r; k++) aux[k] = a[k];
    let i = l;
    let j = m + 1;
    for (let k = l; k <= r; k++) {
      if (i > m) {
        a[k] = aux[j++];
      } else if (j > r) {
        a[k] = aux[i++];
      } else if (aux[j] < aux[i]) {
        a[k] = aux[j++];
      } else {
        a[k] = aux[i++];
      }
      if (!pushStep(steps, a, k, undefined, true, maxSteps)) return false;
    }
    return true;
  }
  function sort(l: number, r: number) {
    if (l >= r || steps.length >= maxSteps) return;
    const m = Math.floor((l + r) / 2);
    sort(l, m);
    sort(m + 1, r);
    merge(l, m, r);
  }
  sort(0, a.length - 1);
  return steps;
}

function genHeapSteps(input: number[], maxSteps: number): Step[] {
  const a = input.slice();
  const steps: Step[] = [{ arr: a.slice() }];
  function heapify(n: number, i: number) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    if (l < n && a[l] > a[largest]) largest = l;
    if (r < n && a[r] > a[largest]) largest = r;
    if (largest !== i) {
      const t = a[i];
      a[i] = a[largest];
      a[largest] = t;
      if (!pushStep(steps, a, i, largest, true, maxSteps)) return;
      heapify(n, largest);
    }
  }
  for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) {
    heapify(a.length, i);
    if (steps.length >= maxSteps) return steps;
  }
  for (let i = a.length - 1; i > 0; i--) {
    const t = a[0];
    a[0] = a[i];
    a[i] = t;
    if (!pushStep(steps, a, 0, i, true, maxSteps)) return steps;
    heapify(i, 0);
    if (steps.length >= maxSteps) return steps;
  }
  return steps;
}

function genCountingSteps(input: number[], maxSteps: number): Step[] {
  const a = input.slice();
  const steps: Step[] = [{ arr: a.slice() }];
  const min = Math.min(...a);
  const max = Math.max(...a);
  const range = max - min + 1;
  if (range > 200) return steps;
  const count = new Array(range).fill(0);
  for (const v of a) count[v - min]++;
  let idx = 0;
  for (let i = 0; i < range; i++) {
    while (count[i]-- > 0) {
      a[idx++] = i + min;
      if (!pushStep(steps, a, idx - 1, undefined, true, maxSteps)) return steps;
    }
  }
  return steps;
}

function genBucketSteps(input: number[], maxSteps: number): Step[] {
  const a = input.slice();
  const steps: Step[] = [{ arr: a.slice() }];
  const min = Math.min(...a);
  const max = Math.max(...a);
  const bucketCount = Math.max(3, Math.min(6, Math.ceil(Math.sqrt(a.length))));
  const buckets: number[][] = Array.from({ length: bucketCount }, () => []);
  const span = (max - min + 1) / bucketCount;
  for (const v of a) {
    const idx = Math.min(bucketCount - 1, Math.floor((v - min) / span));
    buckets[idx].push(v);
  }
  let out = 0;
  for (const b of buckets) {
    b.sort((x, y) => x - y);
    for (const v of b) {
      a[out++] = v;
      if (!pushStep(steps, a, out - 1, undefined, true, maxSteps)) return steps;
    }
  }
  return steps;
}

function genRadixSteps(input: number[], maxSteps: number): Step[] {
  const a = input.slice();
  const steps: Step[] = [{ arr: a.slice() }];
  const min = Math.min(...a);
  if (min < 0) {
    for (let i = 0; i < a.length; i++) a[i] = a[i] - min;
  }
  let exp = 1;
  let max = Math.max(...a);
  while (Math.floor(max / exp) > 0) {
    const output = new Array(a.length).fill(0);
    const count = new Array(10).fill(0);
    for (let i = 0; i < a.length; i++) count[Math.floor(a[i] / exp) % 10]++;
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    for (let i = a.length - 1; i >= 0; i--) {
      const d = Math.floor(a[i] / exp) % 10;
      output[--count[d]] = a[i];
    }
    for (let i = 0; i < a.length; i++) {
      a[i] = output[i];
      if (!pushStep(steps, a, i, undefined, true, maxSteps)) return steps;
    }
    exp *= 10;
    if (steps.length >= maxSteps) break;
  }
  if (min < 0) {
    for (let i = 0; i < a.length; i++) a[i] = a[i] + min;
    pushStep(steps, a, undefined, undefined, false, maxSteps);
  }
  return steps;
}

function genBogoSteps(input: number[], maxSteps: number): Step[] {
  const a = input.slice();
  const steps: Step[] = [{ arr: a.slice() }];
  // Kept for non-visual use; true bogo is animated live in the component.
  return steps;
}

function generate(algorithm: Algo, values: number[], maxSteps: number): Step[] {
  switch (algorithm) {
    case "insertion":
      return genInsertionSteps(values, maxSteps);
    case "selection":
      return genSelectionSteps(values, maxSteps);
    case "shell":
      return genShellSteps(values, maxSteps);
    case "quick":
      return genQuickSteps(values, maxSteps);
    case "merge":
      return genMergeSteps(values, maxSteps);
    case "heap":
      return genHeapSteps(values, maxSteps);
    case "counting":
      return genCountingSteps(values, maxSteps);
    case "bucket":
      return genBucketSteps(values, maxSteps);
    case "radix":
      return genRadixSteps(values, maxSteps);
    case "bogo":
      return genBogoSteps(values, maxSteps);
    case "bubble":
    default:
      return genBubbleSteps(values, maxSteps);
  }
}

export default function SortVisualizer({
  algorithm = "bubble",
  values,
  size = 50,
  seed = 42,
  speed = 22,
  maxSteps = 1200,
  autoPlay = false,
}: {
  algorithm?: Algo;
  values?: number[];
  size?: number;
  seed?: number;
  speed?: number; // ms per step
  maxSteps?: number;
  autoPlay?: boolean;
}) {
  const resolved = useMemo(() => values ?? makeValues(size, seed), [values, size, seed]);
  const steps = useMemo(() => generate(algorithm, resolved, maxSteps), [algorithm, resolved, maxSteps]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);
  const [bogoArr, setBogoArr] = useState<number[]>(resolved);
  const [bogoTries, setBogoTries] = useState(0);
  const timerRef = useRef<number | null>(null);
  const isBogo = algorithm === "bogo";

  useEffect(() => {
    setIdx(0);
    setPlaying(autoPlay);
    setBogoArr(resolved);
    setBogoTries(0);
  }, [algorithm, resolved, maxSteps, autoPlay]);

  useEffect(() => {
    if (!playing) return;
    timerRef.current = window.setInterval(() => {
      if (isBogo) {
        setBogoArr((prev) => {
          const next = prev.slice();
          for (let i = next.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const t = next[i];
            next[i] = next[j];
            next[j] = t;
          }
          if (isSorted(next)) {
            setPlaying(false);
          }
          return next;
        });
        setBogoTries((t) => t + 1);
        return;
      }

      setIdx((i) => {
        if (i + 1 < steps.length) return i + 1;
        setPlaying(false);
        return i;
      });
    }, Math.max(16, speed));
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [playing, speed, steps.length, isBogo]);

  const s = steps[idx] ?? steps[0];
  const viewArr = isBogo ? bogoArr : (s?.arr ?? resolved);
  const max = Math.max(...viewArr, 1);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-xs font-mono text-[var(--terminal-muted)]">
        <span>algorithm: {algorithm}</span>
        {isBogo ? (
          <span>tries: {bogoTries}</span>
        ) : (
          <span>step: {idx + 1}/{steps.length}</span>
        )}
        <button
          className="rounded border border-[var(--terminal-border)] px-2 py-1 text-[var(--foreground)]"
          onClick={() => {
            if (playing) {
              setPlaying(false);
              return;
            }
            if (isBogo) {
              setBogoArr(resolved);
              setBogoTries(0);
            } else {
              setIdx(0);
            }
            setPlaying(true);
          }}
        >
          {playing ? "pause" : "play"}
        </button>
      </div>
      <div className="flex h-40 items-end gap-1 rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)] p-2">
        {viewArr.map((v, i) => {
          const h = Math.max(6, Math.round((v / max) * 100));
          const active = !isBogo && (i === s?.i || i === s?.j);
          const color = active ? (s.swapped ? "#ef4444" : "#22c55e") : "#6b7280";
          return (
            <div key={i} className="flex h-full flex-1 items-end">
              <div
                style={{
                  height: `${h}%`,
                  backgroundColor: color,
                  transition: "none",
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
