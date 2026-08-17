"use client";

import { useEffect, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

type PasteShareToolProps = {
  locale: ToolLocale;
};

type PasteImage = {
  url: string;
  contentType: string;
  size: number;
};

type CreatePasteResponse = {
  code: string;
  url: string;
  createdAt: string;
  expiresAt: string;
  hasText: boolean;
  image: PasteImage | null;
};

type ImageUploadResponse = {
  key: string;
  url: string;
  uploadUrl: string;
  contentType: string;
};

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.kayaweb3.xyz/v1").replace(/\/$/, "");
const MAX_CHARACTERS = 250_000;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set(["image/avif", "image/gif", "image/jpeg", "image/png", "image/webp"]);

const copy = {
  en: {
    content: "Text or code",
    contentPlaceholder: "Paste a snippet, note, log, or code block. You can also paste an image here...",
    image: "Image (optional)",
    imageHint: "Paste an image in the text area, drop one here, or choose a file. PNG, JPEG, GIF, WebP, AVIF · up to 10 MB.",
    chooseImage: "Choose image",
    removeImage: "Remove image",
    imageReady: "Image ready to share",
    invalidImage: "Use a PNG, JPEG, GIF, WebP, or AVIF image up to 10 MB.",
    customCode: "Custom link (optional)",
    codePlaceholder: "release-notes",
    expires: "Expires after",
    hour: "1 hour",
    day: "24 hours",
    week: "7 days",
    create: "Create share link",
    creating: "Creating link...",
    uploading: "Uploading image...",
    copied: "Copied",
    copy: "Copy link",
    newPaste: "Create another paste",
    characterLimit: "characters",
    expiryNote: "Pastes and attached images expire automatically. Do not use this for secrets or private data.",
    ready: "Your share link is ready",
    expiresAt: "Expires",
    raw: "Open raw text",
    imageAttached: "Image attached",
    invalidCode: "Custom link must use 4-50 letters, numbers, underscores, or hyphens.",
    empty: "Add some text, code, or an image before creating a link.",
    copyFailed: "Copy failed. Select the link and copy it manually.",
    uploadFailed: "The image could not be uploaded. Check the file and try again.",
  },
  zh: {
    content: "文本或代码",
    contentPlaceholder: "粘贴一段文本、笔记、日志或代码。也可以直接在这里粘贴图片...",
    image: "图片（可选）",
    imageHint: "可在文本框内直接粘贴图片、拖放图片，或选择本地文件。支持 PNG、JPEG、GIF、WebP、AVIF，最大 10 MB。",
    chooseImage: "选择图片",
    removeImage: "移除图片",
    imageReady: "图片已准备好分享",
    invalidImage: "请选择不超过 10 MB 的 PNG、JPEG、GIF、WebP 或 AVIF 图片。",
    customCode: "自定义链接（可选）",
    codePlaceholder: "release-notes",
    expires: "保存时长",
    hour: "1 小时",
    day: "24 小时",
    week: "7 天",
    create: "创建分享链接",
    creating: "正在创建链接...",
    uploading: "正在上传图片...",
    copied: "已复制",
    copy: "复制链接",
    newPaste: "创建新的分享",
    characterLimit: "个字符",
    expiryNote: "内容和附带图片会自动过期，请不要用来分享密码、密钥或私密数据。",
    ready: "分享链接已创建",
    expiresAt: "过期时间",
    raw: "打开纯文本",
    imageAttached: "已附带图片",
    invalidCode: "自定义链接只能使用 4-50 位字母、数字、下划线或连字符。",
    empty: "请先输入文本、代码或添加一张图片。",
    copyFailed: "复制失败，请手动选择链接复制。",
    uploadFailed: "图片上传失败，请检查图片后重试。",
  },
} as const;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong while creating the paste.";
}

async function readJson<T>(response: Response): Promise<T & { error?: string }> {
  return response.json() as Promise<T & { error?: string }>;
}

export default function PasteShareTool({ locale }: PasteShareToolProps) {
  const text = copy[locale];
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [customCode, setCustomCode] = useState("");
  const [expiresInHours, setExpiresInHours] = useState("24");
  const [paste, setPaste] = useState<CreatePasteResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copyLabel, setCopyLabel] = useState<string>(text.copy);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }

    const preview = URL.createObjectURL(imageFile);
    setImagePreview(preview);
    return () => URL.revokeObjectURL(preview);
  }, [imageFile]);

  function selectImage(file: File | null) {
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.has(file.type) || file.size < 1 || file.size > MAX_IMAGE_BYTES) {
      setError(text.invalidImage);
      return;
    }
    setImageFile(file);
    setError("");
  }

  function handleClipboardPaste(event: React.ClipboardEvent<HTMLTextAreaElement>) {
    const imageItem = Array.from(event.clipboardData.items).find((item) => item.kind === "file" && ACCEPTED_IMAGE_TYPES.has(item.type));
    const image = imageItem?.getAsFile();
    if (!image) return;

    event.preventDefault();
    selectImage(image);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedContent = content.trim();
    const trimmedCode = customCode.trim();

    if (!trimmedContent && !imageFile) {
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
      let image: { key: string } | undefined;

      if (imageFile) {
        setUploading(true);
        const uploadResponse = await fetch(`${API_BASE_URL}/uploads/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contentType: imageFile.type, size: imageFile.size }),
        });
        const upload = await readJson<ImageUploadResponse>(uploadResponse);
        if (!uploadResponse.ok) throw new Error(upload.error ?? text.uploadFailed);

        const putResponse = await fetch(upload.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": upload.contentType },
          body: imageFile,
        });
        if (!putResponse.ok) throw new Error(text.uploadFailed);
        image = { key: upload.key };
      }

      const response = await fetch(`${API_BASE_URL}/pastes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: trimmedContent,
          image,
          customCode: trimmedCode || undefined,
          expiresInHours: Number(expiresInHours),
        }),
      });
      const data = await readJson<CreatePasteResponse>(response);
      if (!response.ok) throw new Error(data.error ?? "Unable to create a paste.");
      setPaste(data);
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setLoading(false);
      setUploading(false);
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
    setImageFile(null);
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
          <button type="button" onClick={reset} className="button-secondary">{text.newPaste}</button>
        </div>
        <div className="share-link-row">
          <input aria-label="Share link" value={paste.url} readOnly className="tool-input font-mono" />
          <button type="button" onClick={copyLink} className="button-primary shrink-0">{copyLabel}</button>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
          <span>{text.expiresAt}: {new Date(paste.expiresAt).toLocaleString(locale === "zh" ? "zh-CN" : "en-US")}</span>
          {paste.image ? <span>{text.imageAttached}</span> : null}
          {paste.hasText ? <a href={rawUrl} target="_blank" rel="noreferrer" className="text-link">{text.raw}</a> : null}
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
            onPaste={handleClipboardPaste}
            placeholder={text.contentPlaceholder}
            rows={12}
            className="tool-input min-h-64 resize-y font-mono"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <span className="tool-label">{text.image}</span>
          <div
            className="paste-image-drop"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              selectImage(event.dataTransfer.files.item(0));
            }}
          >
            {imagePreview ? <img src={imagePreview} alt="Selected paste" className="paste-image-preview" /> : <div className="paste-image-placeholder" aria-hidden="true">IMG</div>}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--foreground)]">{imageFile ? text.imageReady : text.imageHint}</p>
              {imageFile ? <p className="mt-1 truncate font-mono text-xs text-[var(--muted)]">{imageFile.name} · {(imageFile.size / 1024 / 1024).toFixed(2)} MB</p> : null}
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <label htmlFor="paste-image" className="button-secondary cursor-pointer">{text.chooseImage}</label>
              {imageFile ? <button type="button" onClick={() => setImageFile(null)} className="button-secondary">{text.removeImage}</button> : null}
            </div>
            <input id="paste-image" type="file" accept="image/avif,image/gif,image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => selectImage(event.target.files?.item(0) ?? null)} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_12rem]">
          <label className="space-y-2">
            <span className="tool-label">{text.customCode}</span>
            <input value={customCode} onChange={(event) => setCustomCode(event.target.value)} placeholder={text.codePlaceholder} maxLength={50} className="tool-input" />
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
          <button type="submit" disabled={loading} className="button-primary">{uploading ? text.uploading : loading ? text.creating : text.create}</button>
        </div>
      </form>
    </section>
  );
}
