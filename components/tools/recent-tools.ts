export const RECENT_TOOLS_STORAGE_KEY = "kaya_recent_tools_v1";
export const RECENT_TOOLS_LIMIT = 6;

export function readRecentToolSlugs() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(RECENT_TOOLS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string").slice(0, RECENT_TOOLS_LIMIT);
  } catch {
    return [];
  }
}

export function writeRecentToolSlug(slug: string) {
  if (typeof window === "undefined") return;

  const next = [slug, ...readRecentToolSlugs().filter((item) => item !== slug)].slice(0, RECENT_TOOLS_LIMIT);
  window.localStorage.setItem(RECENT_TOOLS_STORAGE_KEY, JSON.stringify(next));
}
