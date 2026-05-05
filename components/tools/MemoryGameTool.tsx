"use client";

import { useEffect, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

const ICONS = ["A", "B", "C", "D", "E", "F"];

const TEXT = {
  en: {
    command: "memory game",
    reset: "New board",
    moves: "Moves",
    done: "Completed pairs",
  },
  zh: {
    command: "memory game",
    reset: "新一局",
    moves: "步数",
    done: "已完成配对",
  },
} as const;

type Card = {
  id: number;
  value: string;
  open: boolean;
  matched: boolean;
};

function shuffleCards() {
  const cards = [...ICONS, ...ICONS]
    .map((value, index) => ({ id: index + 1, value, open: false, matched: false }))
    .sort(() => Math.random() - 0.5);
  return cards;
}

export default function MemoryGameTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [cards, setCards] = useState<Card[]>(() => shuffleCards());
  const [moves, setMoves] = useState(0);

  const openCards = cards.filter((card) => card.open && !card.matched);
  const locked = openCards.length >= 2;
  const matchedCount = cards.filter((card) => card.matched).length / 2;

  useEffect(() => {
    if (openCards.length !== 2) return;

    const [first, second] = openCards;
    const timer = window.setTimeout(() => {
      setCards((current) =>
        current.map((card) => {
          if (card.id !== first.id && card.id !== second.id) return card;
          if (first.value === second.value) {
            return { ...card, matched: true };
          }
          return { ...card, open: false };
        }),
      );
    }, 700);

    return () => window.clearTimeout(timer);
  }, [openCards]);

  const handleCardClick = (id: number) => {
    if (locked) return;
    const card = cards.find((item) => item.id === id);
    if (!card || card.open || card.matched || openCards.length >= 2) return;

    setCards((current) => current.map((item) => (item.id === id ? { ...item, open: true } : item)));
    if (openCards.length === 1) {
      setMoves((value) => value + 1);
    }
  };

  const reset = () => {
    setCards(shuffleCards());
    setMoves(0);
  };

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/memory-game</span>
        <span>{text.command}</span>
      </div>
      <div className="flex flex-wrap gap-4">
        <button type="button" onClick={reset} className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 px-4 py-3 font-mono hover:bg-[var(--terminal-panel-bg)]/70">
          {text.reset}
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.moves}</div>
          <div className="mt-2 font-mono text-lg">{moves}</div>
        </div>
        <div className="rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/30 p-4">
          <div className="text-sm font-medium">{text.done}</div>
          <div className="mt-2 font-mono text-lg">{matchedCount}/{ICONS.length}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => handleCardClick(card.id)}
            className={`rounded-lg border px-4 py-6 font-mono text-xl transition-colors ${
              card.open || card.matched
                ? "border-[var(--terminal-accent)] bg-[var(--terminal-panel-bg)]/60"
                : "border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/20 hover:bg-[var(--terminal-panel-bg)]/40"
            }`}
          >
            {card.open || card.matched ? card.value : "?"}
          </button>
        ))}
      </div>
    </section>
  );
}
