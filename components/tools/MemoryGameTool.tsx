"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const IMAGE_PATHS = Array.from({ length: 51 }, (_, index) => `/memory-game/${index + 1}.png`);
const PAIR_OPTIONS = [6, 8, 10, 12, 16, 20, 24] as const;
const DEFAULT_PAIR_COUNT = 8;
const BEST_KEY_PREFIX = "kaya:memory-game:best-moves:v1";

const TEXT = {
  en: {
    command: "memory game",
    reset: "New board",
    moves: "Moves",
    done: "Completed pairs",
    pairs: "Pairs",
    best: "Best record",
    noBest: "No record yet",
    last: "Last result",
    noLast: "Finish a board to record a result.",
    completeTitle: "Congratulations, board completed.",
    completeBody: "You finished this board in {moves} moves.",
    cardBack: "Hidden card",
    cardImage: "Memory card image",
  },
  zh: {
    command: "memory game",
    reset: "新一局",
    moves: "步数",
    done: "已完成配对",
    pairs: "配对数量",
    best: "最好纪录",
    noBest: "暂无纪录",
    last: "本次结果",
    noLast: "完成一局后会记录结果。",
    completeTitle: "恭喜，已完成本局。",
    completeBody: "你用了 {moves} 步完成。",
    cardBack: "未翻开的卡片",
    cardImage: "记忆卡片图片",
  },
} as const;

type PairCount = (typeof PAIR_OPTIONS)[number];

type Card = {
  id: string;
  image: string;
  open: boolean;
  matched: boolean;
};

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function createCards(pairCount: number, randomize: boolean) {
  const images = randomize ? shuffle(IMAGE_PATHS).slice(0, pairCount) : IMAGE_PATHS.slice(0, pairCount);
  const cards = images.flatMap((image, index) => [
    { id: `${index}-a`, image, open: false, matched: false },
    { id: `${index}-b`, image, open: false, matched: false },
  ]);

  return randomize ? shuffle(cards) : cards;
}

function getBestKey(pairCount: number) {
  return `${BEST_KEY_PREFIX}:${pairCount}`;
}

function getBrowserStorage() {
  try {
    if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
      return null;
    }
    return window.localStorage;
  } catch {
    return null;
  }
}

function readBestMoves(pairCount: number) {
  const storage = getBrowserStorage();
  if (!storage) return null;

  const stored = storage.getItem(getBestKey(pairCount));
  const parsed = stored ? Number(stored) : null;
  return Number.isFinite(parsed) && parsed !== null ? parsed : null;
}

function writeBestMoves(pairCount: number, moves: number) {
  const storage = getBrowserStorage();
  if (!storage) return;
  storage.setItem(getBestKey(pairCount), String(moves));
}

export default function MemoryGameTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [pairCount, setPairCount] = useState<PairCount>(DEFAULT_PAIR_COUNT);
  const [cards, setCards] = useState<Card[]>(() => createCards(DEFAULT_PAIR_COUNT, false));
  const [moves, setMoves] = useState(0);
  const [bestMoves, setBestMoves] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  const openCards = useMemo(() => cards.filter((card) => card.open && !card.matched), [cards]);
  const locked = openCards.length >= 2 || completed;
  const matchedCount = cards.filter((card) => card.matched).length / 2;
  const isComplete = cards.length > 0 && matchedCount === pairCount;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setCards(createCards(DEFAULT_PAIR_COUNT, true));
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setBestMoves(readBestMoves(pairCount));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pairCount]);

  useEffect(() => {
    if (openCards.length !== 2) return;

    const [first, second] = openCards;
    const timer = window.setTimeout(() => {
      setCards((current) =>
        current.map((card) => {
          if (card.id !== first.id && card.id !== second.id) return card;
          if (first.image === second.image) {
            return { ...card, matched: true };
          }
          return { ...card, open: false };
        }),
      );
    }, 650);

    return () => window.clearTimeout(timer);
  }, [openCards]);

  useEffect(() => {
    if (!isComplete || completed) return;

    const frame = window.requestAnimationFrame(() => {
      setCompleted(true);
      setLastResult(moves);
      setBestMoves((currentBest) => {
        const nextBest = currentBest === null || moves < currentBest ? moves : currentBest;
        writeBestMoves(pairCount, nextBest);
        return nextBest;
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [completed, isComplete, moves, pairCount]);

  const startNewGame = (nextPairCount = pairCount) => {
    setPairCount(nextPairCount);
    setCards(createCards(nextPairCount, true));
    setMoves(0);
    setCompleted(false);
  };

  const handlePairCountChange = (value: string) => {
    const nextPairCount = Number(value) as PairCount;
    if (!PAIR_OPTIONS.includes(nextPairCount)) return;
    startNewGame(nextPairCount);
  };

  const handleCardClick = (id: string) => {
    if (locked) return;
    const card = cards.find((item) => item.id === id);
    if (!card || card.open || card.matched || openCards.length >= 2) return;

    setCards((current) => current.map((item) => (item.id === id ? { ...item, open: true } : item)));
    if (openCards.length === 1) {
      setMoves((value) => value + 1);
    }
  };

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/memory-game</span>
        <span>{text.command}</span>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="grid gap-2 text-sm text-[var(--terminal-muted)]">
          <span>{text.pairs}</span>
          <select
            value={pairCount}
            onChange={(event) => handlePairCountChange(event.target.value)}
            className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 px-3 py-3 font-mono text-[var(--foreground)] outline-none focus:border-[var(--terminal-accent)]"
          >
            {PAIR_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => startNewGame()}
          className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 px-4 py-3 font-mono hover:bg-[var(--terminal-panel-bg)]/70"
        >
          {text.reset}
        </button>
      </div>

      {completed ? (
        <div className="rounded-lg border border-[var(--terminal-accent)] bg-[var(--terminal-panel-bg)]/45 p-4">
          <h2 className="text-base font-semibold text-[var(--terminal-accent)]">{text.completeTitle}</h2>
          <p className="mt-2 text-sm text-[var(--foreground)]/85">{text.completeBody.replace("{moves}", String(moves))}</p>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.moves}</div>
          <div className="mt-2 font-mono text-lg">{moves}</div>
        </div>
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.done}</div>
          <div className="mt-2 font-mono text-lg">
            {matchedCount}/{pairCount}
          </div>
        </div>
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.last}</div>
          <div className="mt-2 font-mono text-lg">{lastResult === null ? text.noLast : `${lastResult}`}</div>
        </div>
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.best}</div>
          <div className="mt-2 font-mono text-lg">{bestMoves === null ? text.noBest : `${bestMoves}`}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {cards.map((card) => {
          const visible = card.open || card.matched;

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(card.id)}
              aria-label={visible ? text.cardImage : text.cardBack}
              className={`flex aspect-square items-center justify-center rounded-lg border p-2 transition-colors ${
                visible
                  ? "border-[var(--terminal-accent)] bg-[var(--terminal-panel-bg)]/65"
                  : "border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/20 hover:bg-[var(--terminal-panel-bg)]/40"
              }`}
            >
              {visible ? (
                <Image
                  src={card.image}
                  alt=""
                  width={35}
                  height={35}
                  className="h-12 w-12 object-contain [image-rendering:pixelated]"
                />
              ) : (
                <span className="font-mono text-xl text-[var(--terminal-muted)]">?</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
