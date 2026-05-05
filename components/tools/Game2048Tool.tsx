"use client";

import { useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const SIZE = 4;

const TEXT = {
  en: {
    command: "play 2048",
    newGame: "New game",
    score: "Score",
    status: "Status",
    won: "2048 reached.",
    running: "Keep merging tiles.",
    lost: "No moves left.",
    up: "Up",
    down: "Down",
    left: "Left",
    right: "Right",
  },
  zh: {
    command: "play 2048",
    newGame: "新游戏",
    score: "分数",
    status: "状态",
    won: "已经达到 2048。",
    running: "继续合并方块。",
    lost: "已经没有可走步。",
    up: "上",
    down: "下",
    left: "左",
    right: "右",
  },
} as const;

type Board = number[][];

function emptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => 0));
}

function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

function randomTileValue() {
  return Math.random() < 0.9 ? 2 : 4;
}

function addRandomTile(board: Board): Board {
  const next = cloneBoard(board);
  const emptyCells: Array<[number, number]> = [];
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (next[row][col] === 0) emptyCells.push([row, col]);
    }
  }
  if (emptyCells.length === 0) return next;
  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  next[row][col] = randomTileValue();
  return next;
}

function createInitialBoard() {
  return addRandomTile(addRandomTile(emptyBoard()));
}

function slideLine(line: number[]) {
  const compact = line.filter((value) => value !== 0);
  const merged: number[] = [];
  let score = 0;

  for (let index = 0; index < compact.length; index += 1) {
    if (compact[index] === compact[index + 1]) {
      const value = compact[index] * 2;
      merged.push(value);
      score += value;
      index += 1;
    } else {
      merged.push(compact[index]);
    }
  }

  while (merged.length < SIZE) merged.push(0);
  return { line: merged, score };
}

function rotateClockwise(board: Board): Board {
  return board[0].map((_, col) => board.map((row) => row[col]).reverse());
}

function moveLeft(board: Board) {
  let gained = 0;
  const next = board.map((row) => {
    const moved = slideLine(row);
    gained += moved.score;
    return moved.line;
  });
  return { board: next, gained };
}

function boardsEqual(a: Board, b: Board) {
  return a.every((row, rowIndex) => row.every((value, colIndex) => value === b[rowIndex][colIndex]));
}

function move(board: Board, direction: "up" | "down" | "left" | "right") {
  let working = cloneBoard(board);
  let rotations = 0;
  if (direction === "up") rotations = 3;
  if (direction === "right") rotations = 2;
  if (direction === "down") rotations = 1;

  for (let i = 0; i < rotations; i += 1) working = rotateClockwise(working);
  const moved = moveLeft(working);
  working = moved.board;
  for (let i = 0; i < (4 - rotations) % 4; i += 1) working = rotateClockwise(working);
  return { board: working, gained: moved.gained };
}

function hasWon(board: Board) {
  return board.some((row) => row.some((value) => value >= 2048));
}

function hasMoves(board: Board) {
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const value = board[row][col];
      if (value === 0) return true;
      if (row + 1 < SIZE && board[row + 1][col] === value) return true;
      if (col + 1 < SIZE && board[row][col + 1] === value) return true;
    }
  }
  return false;
}

export default function Game2048Tool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [score, setScore] = useState(0);

  const handleMove = (direction: "up" | "down" | "left" | "right") => {
    const moved = move(board, direction);
    if (boardsEqual(board, moved.board)) return;
    setBoard(addRandomTile(moved.board));
    setScore((value) => value + moved.gained);
  };

  const reset = () => {
    setBoard(createInitialBoard());
    setScore(0);
  };

  const status = hasWon(board) ? text.won : hasMoves(board) ? text.running : text.lost;

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/2048-game</span>
        <span>{text.command}</span>
      </div>
      <div className="flex flex-wrap gap-4">
        <button type="button" onClick={reset} className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 px-4 py-3 font-mono hover:bg-[var(--terminal-panel-bg)]/70">
          {text.newGame}
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.score}</div>
          <div className="mt-2 font-mono text-lg">{score}</div>
        </div>
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.status}</div>
          <div className="mt-2 font-mono text-lg">{status}</div>
        </div>
      </div>
      <div className="grid gap-2 sm:max-w-xs">
        <button type="button" onClick={() => handleMove("up")} className="rounded border border-[var(--terminal-border)] px-3 py-2 font-mono hover:bg-[var(--terminal-panel-bg)]/40">{text.up}</button>
        <div className="grid grid-cols-3 gap-2">
          <button type="button" onClick={() => handleMove("left")} className="rounded border border-[var(--terminal-border)] px-3 py-2 font-mono hover:bg-[var(--terminal-panel-bg)]/40">{text.left}</button>
          <button type="button" onClick={() => handleMove("down")} className="rounded border border-[var(--terminal-border)] px-3 py-2 font-mono hover:bg-[var(--terminal-panel-bg)]/40">{text.down}</button>
          <button type="button" onClick={() => handleMove("right")} className="rounded border border-[var(--terminal-border)] px-3 py-2 font-mono hover:bg-[var(--terminal-panel-bg)]/40">{text.right}</button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 sm:max-w-md">
        {board.flatMap((row, rowIndex) =>
          row.map((value, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className="flex aspect-square items-center justify-center rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 font-mono text-xl">
              {value === 0 ? "" : value}
            </div>
          )),
        )}
      </div>
    </section>
  );
}
