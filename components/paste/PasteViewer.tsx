"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type PasteViewerProps = {
  code: string;
};

type PasteResponse = {
  code: string;
  content: string;
  createdAt: string;
  expiresAt: string;
};

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.kayaweb3.xyz/v1").replace(/\/$/, "");

export default function PasteViewer({ code }: PasteViewerProps) {
  const [paste, setPaste] = useState<PasteResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadPaste() {
      try {
        const response = await fetch(`${API_BASE_URL}/pastes/${encodeURIComponent(code)}`, { signal: controller.signal });
        const data = (await response.json()) as PasteResponse & { error?: string };
        if (!response.ok) throw new Error(data.error ?? "Paste not found.");
        setPaste(data);
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === "AbortError") return;
        setError(loadError instanceof Error ? loadError.message : "Unable to load this paste.");
      }
    }

    loadPaste();
    return () => controller.abort();
  }, [code]);

  return (
    <article className="paste-reader">
      <header className="paste-reader-header">
        <div>
          <p className="eyebrow">Kaya Paste</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{code}</h1>
        </div>
        <Link href="/tools/paste" className="button-secondary">Create a paste</Link>
      </header>

      {error ? (
        <div className="notice-error mt-8" role="alert">{error}</div>
      ) : !paste ? (
        <div className="mt-8 h-72 animate-pulse rounded-2xl bg-[var(--surface-muted)]" aria-label="Loading paste" />
      ) : (
        <>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
            <span>Created {new Date(paste.createdAt).toLocaleString()}</span>
            <span>Expires {new Date(paste.expiresAt).toLocaleString()}</span>
          </div>
          <pre className="paste-content">{paste.content}</pre>
        </>
      )}
    </article>
  );
}
