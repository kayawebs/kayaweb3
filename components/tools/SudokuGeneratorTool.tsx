"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

const TEXT = {
  en: {
    command: "generate sudoku",
    newPuzzle: "New puzzle",
    filled: "Filled cells",
    correct: "Correct entries",
    status: "Status",
    ready: "Fill the empty cells.",
    solved: "Puzzle matches the solution.",
    finalMode: "Final",
    draftMode: "Draft",
    clear: "Clear",
  },
  zh: {
    command: "generate sudoku",
    newPuzzle: "新题目",
    filled: "已填写格子",
    correct: "正确填写",
    status: "状态",
    ready: "填写空白格。",
    solved: "题目已经与答案一致。",
    finalMode: "正式",
    draftMode: "草稿",
    clear: "清除",
  },
} as const;

type Puzzle = {
  puzzle: string[][];
  solution: string[][];
};

type Mode = "final" | "draft";

type Position = {
  row: number;
  col: number;
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

function emptyNotes() {
  return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => [] as string[]));
}

function samePosition(a: Position | null, row: number, col: number) {
  return a?.row === row && a.col === col;
}

function borderClass(row: number, col: number) {
  const classes = ["border-[var(--terminal-border)]"];
  if (row % 3 === 0) classes.push("border-t-2 border-t-[var(--foreground)]/70");
  if (col % 3 === 0) classes.push("border-l-2 border-l-[var(--foreground)]/70");
  if (row === 8) classes.push("border-b-2 border-b-[var(--foreground)]/70");
  if (col === 8) classes.push("border-r-2 border-r-[var(--foreground)]/70");
  return classes.join(" ");
}

export default function SudokuGeneratorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [game, setGame] = useState<Puzzle>(() => generatePuzzle());
  const [entries, setEntries] = useState<string[][]>(() => game.puzzle.map((row) => [...row]));
  const [notes, setNotes] = useState<string[][][]>(() => emptyNotes());
  const [mode, setMode] = useState<Mode>("final");
  const [selected, setSelected] = useState<Position | null>(null);

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
    setNotes(emptyNotes());
    setSelected(null);
    setMode("final");
  };

  const applyDigit = useCallback((row: number, col: number, digit: string) => {
    if (game.puzzle[row][col] !== "") return;

    if (mode === "final") {
      setEntries((current) => current.map((line, rowIndex) => (rowIndex === row ? line.map((cell, colIndex) => (colIndex === col ? digit : cell)) : line)));
      setNotes((current) => current.map((line, rowIndex) => (rowIndex === row ? line.map((cell, colIndex) => (colIndex === col ? [] : cell)) : line)));
      return;
    }

    setEntries((current) => current.map((line, rowIndex) => (rowIndex === row ? line.map((cell, colIndex) => (colIndex === col ? "" : cell)) : line)));
    setNotes((current) =>
      current.map((line, rowIndex) =>
        rowIndex === row
          ? line.map((cell, colIndex) => {
              if (colIndex !== col) return cell;
              return cell.includes(digit) ? cell.filter((value) => value !== digit) : [...cell, digit].sort();
            })
          : line,
      ),
    );
  }, [game.puzzle, mode]);

  const clearCell = useCallback((position = selected) => {
    if (!position || game.puzzle[position.row][position.col] !== "") return;
    setEntries((current) => current.map((line, rowIndex) => (rowIndex === position.row ? line.map((cell, colIndex) => (colIndex === position.col ? "" : cell)) : line)));
    setNotes((current) => current.map((line, rowIndex) => (rowIndex === position.row ? line.map((cell, colIndex) => (colIndex === position.col ? [] : cell)) : line)));
  }, [game.puzzle, selected]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, row: number, col: number) => {
    if (DIGITS.includes(event.key as (typeof DIGITS)[number])) {
      event.preventDefault();
      applyDigit(row, col, event.key);
      return;
    }

    if (event.key === "Backspace" || event.key === "Delete" || event.key === "0") {
      event.preventDefault();
      clearCell({ row, col });
    }
  };

  const selectedCell = selected && game.puzzle[selected.row][selected.col] === "" ? selected : null;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!selectedCell) return;

      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }

      if (DIGITS.includes(event.key as (typeof DIGITS)[number])) {
        event.preventDefault();
        applyDigit(selectedCell.row, selectedCell.col, event.key);
      }

      if (event.key === "Backspace" || event.key === "Delete" || event.key === "0") {
        event.preventDefault();
        clearCell(selectedCell);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [applyDigit, clearCell, selectedCell]);

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
          <div className="mt-2 font-mono text-lg">
            {stats.filled}/{stats.totalBlanks}
          </div>
        </div>
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.correct}</div>
          <div className="mt-2 font-mono text-lg">
            {stats.correct}/{stats.totalBlanks}
          </div>
        </div>
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.status}</div>
          <div className="mt-2 font-mono text-sm">{stats.solved ? text.solved : text.ready}</div>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,34rem)_10rem]">
        <div className="grid aspect-square w-full max-w-xl grid-cols-9 overflow-hidden rounded-lg border-2 border-[var(--foreground)]/70 bg-[var(--terminal-panel-bg)]/20">
          {entries.flatMap((row, rowIndex) =>
            row.map((value, colIndex) => {
              const fixed = game.puzzle[rowIndex][colIndex] !== "";
              const currentNotes = notes[rowIndex][colIndex];
              const isSelected = samePosition(selected, rowIndex, colIndex);

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  type="button"
                  onClick={() => setSelected({ row: rowIndex, col: colIndex })}
                  onKeyDown={(event) => handleKeyDown(event, rowIndex, colIndex)}
                  aria-pressed={isSelected}
                  className={`relative flex aspect-square min-w-0 items-center justify-center border bg-transparent font-mono outline-none transition-colors ${borderClass(rowIndex, colIndex)} ${
                    fixed
                      ? "bg-[var(--terminal-panel-bg)]/65 text-[var(--foreground)]"
                      : isSelected
                        ? "z-10 bg-[var(--terminal-accent)]/22 shadow-[inset_0_0_0_2px_var(--terminal-accent),0_0_18px_rgba(34,197,94,0.22)]"
                        : "hover:bg-[var(--terminal-panel-bg)]/45 focus:bg-[var(--terminal-panel-bg)]/55"
                  }`}
                >
                  {value ? (
                    <span className={`text-lg font-semibold sm:text-2xl ${fixed ? "" : "text-[var(--terminal-accent)]"}`}>{value}</span>
                  ) : currentNotes.length > 0 ? (
                    <span className="grid h-full w-full grid-cols-3 grid-rows-3 px-1 py-0.5 text-[10px] leading-none text-[var(--terminal-muted)] sm:text-xs">
                      {DIGITS.map((digit) => (
                        <span key={digit} className="flex items-center justify-center">
                          {currentNotes.includes(digit) ? digit : ""}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </button>
              );
            }),
          )}
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-[var(--terminal-border)]">
            <button
              type="button"
              onClick={() => setMode("final")}
              className={`px-3 py-2 text-sm font-medium ${mode === "final" ? "bg-[var(--terminal-accent)] text-[#02040a]" : "bg-[var(--terminal-panel-bg)]/30"}`}
            >
              {text.finalMode}
            </button>
            <button
              type="button"
              onClick={() => setMode("draft")}
              className={`px-3 py-2 text-sm font-medium ${mode === "draft" ? "bg-[var(--terminal-accent)] text-[#02040a]" : "bg-[var(--terminal-panel-bg)]/30"}`}
            >
              {text.draftMode}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {DIGITS.map((digit) => (
              <button
                key={digit}
                type="button"
                disabled={!selectedCell}
                onClick={() => selectedCell && applyDigit(selectedCell.row, selectedCell.col, digit)}
                className="aspect-square rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/35 font-mono text-lg hover:border-[var(--terminal-accent)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {digit}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={!selectedCell}
            onClick={() => clearCell()}
            className="w-full rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/35 px-3 py-2 text-sm font-medium hover:border-[var(--terminal-accent)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {text.clear}
          </button>
        </div>
      </div>
    </section>
  );
}
