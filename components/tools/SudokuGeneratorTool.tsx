"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const SOLVED_BOARD = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [4, 5, 6, 7, 8, 9, 1, 2, 3],
  [7, 8, 9, 1, 2, 3, 4, 5, 6],
  [2, 3, 4, 5, 6, 7, 8, 9, 1],
  [5, 6, 7, 8, 9, 1, 2, 3, 4],
  [8, 9, 1, 2, 3, 4, 5, 6, 7],
  [3, 4, 5, 6, 7, 8, 9, 1, 2],
  [6, 7, 8, 9, 1, 2, 3, 4, 5],
  [9, 1, 2, 3, 4, 5, 6, 7, 8],
] as const;

const TEXT = {
  en: {
    command: "generate sudoku",
    newPuzzle: "New puzzle",
    filled: "Filled cells",
    correct: "Correct entries",
    status: "Status",
    ready: "Fill the empty cells.",
    solved: "Puzzle matches the solution.",
  },
  zh: {
    command: "generate sudoku",
    newPuzzle: "新题目",
    filled: "已填写格子",
    correct: "正确填写",
    status: "状态",
    ready: "填写空白格。",
    solved: "题目已经与答案一致。",
  },
} as const;

type Puzzle = {
  puzzle: string[][];
  solution: string[][];
};

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function generatePuzzle(): Puzzle {
  const digitMap = shuffle(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
  const solution = SOLVED_BOARD.map((row) => row.map((value) => digitMap[value - 1]));
  const puzzle = solution.map((row) => [...row]);
  const blankPositions = shuffle(Array.from({ length: 81 }, (_, index) => index)).slice(0, 42);
  for (const position of blankPositions) {
    const row = Math.floor(position / 9);
    const col = position % 9;
    puzzle[row][col] = "";
  }
  return { puzzle, solution };
}

export default function SudokuGeneratorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [game, setGame] = useState<Puzzle>(() => generatePuzzle());
  const [entries, setEntries] = useState<string[][]>(() => game.puzzle.map((row) => [...row]));

  const stats = useMemo(() => {
    let filled = 0;
    let correct = 0;
    for (let row = 0; row < 9; row += 1) {
      for (let col = 0; col < 9; col += 1) {
        if (game.puzzle[row][col] !== "") continue;
        if (entries[row][col] !== "") filled += 1;
        if (entries[row][col] === game.solution[row][col]) correct += 1;
      }
    }
    const totalBlanks = game.puzzle.flat().filter((cell) => cell === "").length;
    return { filled, correct, totalBlanks, solved: correct === totalBlanks && totalBlanks > 0 };
  }, [entries, game]);

  const reset = () => {
    const next = generatePuzzle();
    setGame(next);
    setEntries(next.puzzle.map((row) => [...row]));
  };

  const handleChange = (row: number, col: number, value: string) => {
    const nextValue = value.replace(/[^1-9]/g, "").slice(0, 1);
    setEntries((current) => current.map((line, rowIndex) => (rowIndex === row ? line.map((cell, colIndex) => (colIndex === col ? nextValue : cell)) : line)));
  };

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/sudoku-generator</span>
        <span>{text.command}</span>
      </div>
      <div className="flex flex-wrap gap-4">
        <button type="button" onClick={reset} className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 px-4 py-3 font-mono hover:bg-[var(--terminal-panel-bg)]/70">
          {text.newPuzzle}
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.filled}</div>
          <div className="mt-2 font-mono text-lg">{stats.filled}/{stats.totalBlanks}</div>
        </div>
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.correct}</div>
          <div className="mt-2 font-mono text-lg">{stats.correct}/{stats.totalBlanks}</div>
        </div>
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.status}</div>
          <div className="mt-2 font-mono text-sm">{stats.solved ? text.solved : text.ready}</div>
        </div>
      </div>
      <div className="grid grid-cols-9 gap-1 sm:max-w-xl">
        {entries.flatMap((row, rowIndex) =>
          row.map((value, colIndex) => {
            const fixed = game.puzzle[rowIndex][colIndex] !== "";
            return (
              <input
                key={`${rowIndex}-${colIndex}`}
                value={value}
                readOnly={fixed}
                onChange={(event) => handleChange(rowIndex, colIndex, event.target.value)}
                className={`aspect-square rounded border text-center font-mono text-sm outline-none ${
                  fixed
                    ? "border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/50 text-[var(--foreground)]"
                    : "border-[var(--terminal-border)] bg-transparent focus:border-[var(--terminal-accent)]"
                }`}
              />
            );
          }),
        )}
      </div>
    </section>
  );
}
