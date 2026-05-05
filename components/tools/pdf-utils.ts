"use client";

export type DownloadArtifact = {
  name: string;
  url: string;
  size: number;
};

export async function readFileAsUint8Array(file: File) {
  return new Uint8Array(await file.arrayBuffer());
}

export function createDownloadArtifact(name: string, bytes: Uint8Array, mimeType = "application/pdf"): DownloadArtifact {
  const copied = new Uint8Array(bytes.byteLength);
  copied.set(bytes);
  const blob = new Blob([copied], { type: mimeType });

  return {
    name,
    url: URL.createObjectURL(blob),
    size: blob.size,
  };
}

export function revokeArtifacts(artifacts: DownloadArtifact[]) {
  artifacts.forEach((artifact) => URL.revokeObjectURL(artifact.url));
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;

  return `${value >= 100 || exponent === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[exponent]}`;
}

export function sanitizeBaseName(name: string, fallback: string) {
  const normalized = name.replace(/\.[^.]+$/, "").trim();
  return normalized || fallback;
}

export function parsePageRanges(input: string, maxPages: number) {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const ranges = trimmed.split(",").map((segment) => segment.trim()).filter(Boolean);
  const output: Array<{ start: number; end: number }> = [];

  for (const range of ranges) {
    const match = range.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) return null;

    const start = Number(match[1]);
    const end = Number(match[2] ?? match[1]);

    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start || end > maxPages) {
      return null;
    }

    output.push({ start, end });
  }

  return output;
}
