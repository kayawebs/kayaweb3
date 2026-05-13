"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const SIZE = 4;
const MOVE_MS = 170;
const BEST_SCORE_KEY = "kaya_2048_best_score_v1";

const TEXT = {
  en: {
    command: "play 2048",
    newGame: "New game",
    score: "Score",
    best: "Best",
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
    best: "最高分",
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

type Direction = "up" | "down" | "left" | "right";

type Tile = {
  id: number;
  row: number;
  col: number;
  value: number;
  isNew?: boolean;
  merged?: boolean;
};

let nextTileId = 1;

function randomTileValue() {
  return Math.random() < 0.9 ? 2 : 4;
}

function createTile(row: number, col: number): Tile {
  const id = nextTileId;
  nextTileId += 1;

  return {
    id,
    row,
    col,
    value: randomTileValue(),
    isNew: true,
  };
}

function getEmptyCells(tiles: Tile[]) {
  const occupied = new Set(tiles.map((tile) => `${tile.row}-${tile.col}`));
  const cells: Array<{ row: number; col: number }> = [];

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (!occupied.has(`${row}-${col}`)) {
        cells.push({ row, col });
      }
    }
  }

  return cells;
}

function addRandomTile(tiles: Tile[]) {
  const emptyCells = getEmptyCells(tiles);
  if (emptyCells.length === 0) return tiles.map((tile) => ({ ...tile, isNew: false, merged: false }));

  const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  return [
    ...tiles.map((tile) => ({ ...tile, isNew: false, merged: false })),
    createTile(cell.row, cell.col),
  ];
}

function createInitialTiles() {
  nextTileId = 1;
  return addRandomTile(addRandomTile([]));
}

function createHydrationSafeTiles(): Tile[] {
  nextTileId = 3;
  return [
    { id: 1, row: 3, col: 1, value: 2, isNew: false },
    { id: 2, row: 3, col: 2, value: 2, isNew: false },
  ];
}

function tileAt(tiles: Tile[], row: number, col: number) {
  return tiles.find((tile) => tile.row === row && tile.col === col);
}

function moveTiles(tiles: Tile[], direction: Direction) {
  const movedTiles: Tile[] = [];
  let gained = 0;
  let changed = false;

  for (let lineIndex = 0; lineIndex < SIZE; lineIndex += 1) {
    const line: Tile[] = [];

    for (let offset = 0; offset < SIZE; offset += 1) {
      const row = direction === "left" || direction === "right" ? lineIndex : direction === "up" ? offset : SIZE - 1 - offset;
      const col = direction === "up" || direction === "down" ? lineIndex : direction === "left" ? offset : SIZE - 1 - offset;
      const tile = tileAt(tiles, row, col);
      if (tile) line.push(tile);
    }

    let targetOffset = 0;

    for (let index = 0; index < line.length; index += 1) {
      const current = line[index];
      const next = line[index + 1];
      const targetRow = direction === "left" || direction === "right" ? lineIndex : direction === "up" ? targetOffset : SIZE - 1 - targetOffset;
      const targetCol = direction === "up" || direction === "down" ? lineIndex : direction === "left" ? targetOffset : SIZE - 1 - targetOffset;

      if (next && current.value === next.value) {
        gained += current.value * 2;
        movedTiles.push({
          ...current,
          row: targetRow,
          col: targetCol,
          value: current.value * 2,
          isNew: false,
          merged: true,
        });
        if (current.row !== targetRow || current.col !== targetCol || next.row !== targetRow || next.col !== targetCol) {
          changed = true;
        }
        index += 1;
      } else {
        movedTiles.push({
          ...current,
          row: targetRow,
          col: targetCol,
          isNew: false,
          merged: false,
        });
        if (current.row !== targetRow || current.col !== targetCol) {
          changed = true;
        }
      }

      targetOffset += 1;
    }
  }

  return { tiles: movedTiles, gained, changed };
}

function hasWon(tiles: Tile[]) {
  return tiles.some((tile) => tile.value >= 2048);
}

function hasMoves(tiles: Tile[]) {
  if (tiles.length < SIZE * SIZE) return true;

  for (const tile of tiles) {
    const neighbors = [
      tileAt(tiles, tile.row + 1, tile.col),
      tileAt(tiles, tile.row - 1, tile.col),
      tileAt(tiles, tile.row, tile.col + 1),
      tileAt(tiles, tile.row, tile.col - 1),
    ];
    if (neighbors.some((neighbor) => neighbor?.value === tile.value)) return true;
  }

  return false;
}

function tileStyle(value: number) {
  const palette: Record<number, { bg: string; color: string }> = {
    2: { bg: "#d6f5df", color: "#102817" },
    4: { bg: "#a7e8bd", color: "#102817" },
    8: { bg: "#6ee7a2", color: "#061d10" },
    16: { bg: "#34d399", color: "#03130a" },
    32: { bg: "#22c55e", color: "#021207" },
    64: { bg: "#facc15", color: "#181000" },
    128: { bg: "#f59e0b", color: "#170d00" },
    256: { bg: "#fb7185", color: "#200208" },
    512: { bg: "#38bdf8", color: "#03121d" },
    1024: { bg: "#a78bfa", color: "#10071f" },
    2048: { bg: "#f5f5f5", color: "#02040a" },
  };

  return palette[value] ?? { bg: "#e879f9", color: "#17051c" };
}

export default function Game2048Tool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [tiles, setTiles] = useState<Tile[]>(() => createHydrationSafeTiles());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = Number(window.localStorage.getItem(BEST_SCORE_KEY) ?? "0");
      if (Number.isFinite(stored) && stored > 0) setBestScore(stored);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const updateScore = useCallback((gained: number) => {
    setScore((current) => {
      const nextScore = current + gained;
      setBestScore((currentBest) => {
        if (nextScore <= currentBest) return currentBest;
        window.localStorage.setItem(BEST_SCORE_KEY, String(nextScore));
        return nextScore;
      });
      return nextScore;
    });
  }, []);

  const handleMove = useCallback((direction: Direction) => {
    if (animating) return;
    const moved = moveTiles(tiles, direction);
    if (!moved.changed) return;

    setAnimating(true);
    setTiles(moved.tiles);
    updateScore(moved.gained);

    window.setTimeout(() => {
      setTiles((current) => addRandomTile(current));
      setAnimating(false);
    }, MOVE_MS);
  }, [animating, tiles, updateScore]);

  useEffect(() => {
    const keyMap: Record<string, Direction> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const direction = keyMap[event.key];
      if (!direction) return;

      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }

      event.preventDefault();
      handleMove(direction);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleMove]);

  const reset = () => {
    setTiles(createInitialTiles());
    setScore(0);
    setAnimating(false);
  };

  const status = hasWon(tiles) ? text.won : hasMoves(tiles) ? text.running : text.lost;
  const cells = useMemo(() => Array.from({ length: SIZE * SIZE }, (_, index) => index), []);

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
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.score}</div>
          <div className="mt-2 font-mono text-lg">{score}</div>
        </div>
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.best}</div>
          <div className="mt-2 font-mono text-lg">{bestScore}</div>
        </div>
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.status}</div>
          <div className="mt-2 font-mono text-sm">{status}</div>
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
      <div
        tabIndex={0}
        className="relative grid aspect-square w-full max-w-md grid-cols-4 grid-rows-4 gap-3 overflow-hidden rounded-lg border border-[var(--terminal-border)] bg-[#10141f] p-3 outline-none focus:border-[var(--terminal-accent)]"
      >
        <div className="pointer-events-none absolute inset-3 grid grid-cols-4 grid-rows-4 gap-3">
          {cells.map((cell) => (
            <div key={cell} className="rounded-md bg-[#050816] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]" />
          ))}
        </div>
        {tiles.map((tile) => {
          const colors = tileStyle(tile.value);
          return (
            <div
              key={tile.id}
              className={`z-10 flex items-center justify-center rounded-md font-mono font-bold shadow-[0_10px_24px_rgba(0,0,0,0.28)] transition-all duration-150 ease-out ${
                tile.isNew ? "animate-[tile-pop_160ms_ease-out]" : ""
              } ${tile.merged ? "scale-[1.03]" : ""}`}
              style={{
                gridColumn: tile.col + 1,
                gridRow: tile.row + 1,
                backgroundColor: colors.bg,
                color: colors.color,
                fontSize: tile.value >= 1024 ? "1.25rem" : "1.5rem",
              }}
            >
              {tile.value}
            </div>
          );
        })}
      </div>
      <style jsx>{`
        @keyframes tile-pop {
          0% {
            opacity: 0;
            scale: 0.62;
          }
          100% {
            opacity: 1;
            scale: 1;
          }
        }
      `}</style>
    </section>
  );
}
