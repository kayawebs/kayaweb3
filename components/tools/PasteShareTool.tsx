"use client";

import { useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

type PasteShareToolProps = {
  locale: ToolLocale;
};

type CreatePasteResponse = {
  code: string;
  url: string;
  createdAt: string;
  expiresAt: string;
};

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.kayaweb3.xyz/v1").replace(/\/$/, "");
const MAX_CHARACTERS = 250_000;

const copy = {
  en: {
    content: "Text or code",
    contentPlaceholder: "Paste a snippet, note, log, or code block...",
    customCode: "Custom link (optional)",
    codePlaceholder: "release-notes",
    expires: "Expires after",
    hour: "1 hour",
    day: "24 hours",
    week: "7 days",
    create: "Create share link",
    creating: "Creating link...",
    copied: "Copied",
    copy: "Copy link",
    newPaste: "Create another paste",
    characterLimit: "characters",
    expiryNote: "Pastes expire automatically. Do not use this for secrets or private data.",
    ready: "Your share link is ready",
    expiresAt: "Expires",
    raw: "Open raw text",
    invalidCode: "Custom link must use 4-50 letters, numbers, underscores, or hyphens.",
    empty: "Add some text or code before creating a link.",
    copyFailed: "Copy failed. Select the link and copy it manually.",
  },
  zh: {
    content: "文本或代码",
    contentPlaceholder: "粘贴一段文本、笔记、日志或代码...",
    customCode: "自定义链接（可选）",
    codePlaceholder: "release-notes",
    expires: "保存时长",
    hour: "1 小时",
    day: "24 小时",
    week: "7 天",
    create: "创建分享链接",
    creating: "正在创建链接...",
    copied: "已复制",
    copy: "复制链接",
    newPaste: "创建新的分享",
    characterLimit: "个字符",
    expiryNote: "内容会自动过期，请不要用来分享密码、密钥或私密数据。",
    ready: "分享链接已创建",
    expiresAt: "过期时间",
    raw: "打开纯文本",
    invalidCode: "自定义链接只能使用 4-50 位字母、数字、下划线或连字符。",
    empty: "请先输入需要分享的文本或代码。",
    copyFailed: "复制失败，请手动选择链接复制。",
  },
} as const;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong while creating the paste.";
}

export default function PasteShareTool({ locale }: PasteShareToolProps) {
  const text = copy[locale];
  const [content, setContent] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [expiresInHours, setExpiresInHours] = useState("24");
  const [paste, setPaste] = useState<CreatePasteResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copyLabel, setCopyLabel] = useState<string>(text.copy);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedContent = content.trim();
    const trimmedCode = customCode.trim();

    if (!trimmedContent) {
      setError(text.empty);
      return;
    }

    if (trimmedCode && !/^[a-zA-Z0-9_-]{4,50}$/.test(trimmedCode)) {
      setError(text.invalidCode);
      return;
    }

    setLoading(true);
    setError("");
    setCopyLabel(text.copy);

    try {
      const response = await fetch(`${API_BASE_URL}/pastes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: trimmedContent,
          customCode: trimmedCode || undefined,
          expiresInHours: Number(expiresInHours),
        }),
      });
      const data = (await response.json()) as CreatePasteResponse & { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to create a paste.");
      }
      setPaste(data);
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    if (!paste) return;

    try {
      await navigator.clipboard.writeText(paste.url);
      setCopyLabel(text.copied);
    } catch {
      setError(text.copyFailed);
    }
  }

  function reset() {
    setContent("");
    setCustomCode("");
    setExpiresInHours("24");
    setPaste(null);
    setError("");
    setCopyLabel(text.copy);
  }

  if (paste) {
    const rawUrl = `${API_BASE_URL}/pastes/${encodeURIComponent(paste.code)}/raw`;
    return (
      <section className="tool-workspace tool-workspace-highlight space-y-5" aria-live="polite">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{text.ready}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">{paste.code}</h2>
          </div>
          <button type="button" onClick={reset} className="button-secondary">
            {text.newPaste}
          </button>
        </div>
        <div className="share-link-row">
          <input aria-label="Share link" value={paste.url} readOnly className="tool-input font-mono" />
          <button type="button" onClick={copyLink} className="button-primary shrink-0">
            {copyLabel}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
          <span>{text.expiresAt}: {new Date(paste.expiresAt).toLocaleString(locale === "zh" ? "zh-CN" : "en-US")}</span>
          <a href={rawUrl} target="_blank" rel="noreferrer" className="text-link">{text.raw}</a>
        </div>
      </section>
    );
  }

  return (
    <section className="tool-workspace">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="paste-content" className="tool-label">{text.content}</label>
            <span className="font-mono text-xs text-[var(--muted)]">{content.length.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()} {text.characterLimit}</span>
          </div>
          <textarea
            id="paste-content"
            value={content}
            onChange={(event) => setContent(event.target.value.slice(0, MAX_CHARACTERS))}
            placeholder={text.contentPlaceholder}
            rows={14}
            className="tool-input min-h-72 resize-y font-mono"
            autoFocus
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_12rem]">
          <label className="space-y-2">
            <span className="tool-label">{text.customCode}</span>
            <input
              value={customCode}
              onChange={(event) => setCustomCode(event.target.value)}
              placeholder={text.codePlaceholder}
              maxLength={50}
              className="tool-input"
            />
          </label>
          <label className="space-y-2">
            <span className="tool-label">{text.expires}</span>
            <select value={expiresInHours} onChange={(event) => setExpiresInHours(event.target.value)} className="tool-input">
              <option value="1">{text.hour}</option>
              <option value="24">{text.day}</option>
              <option value="168">{text.week}</option>
            </select>
          </label>
        </div>
        {error ? <p role="alert" className="notice-error">{error}</p> : null}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-5">
          <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">{text.expiryNote}</p>
          <button type="submit" disabled={loading} className="button-primary">
            {loading ? text.creating : text.create}
          </button>
        </div>
      </form>
    </section>
  );
}
