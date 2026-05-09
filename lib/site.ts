const DEFAULT_SITE_URL = "https://www.kayaweb3.xyz";

function withProtocol(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `https://${url}`;
}

export function getSiteUrl() {
  const envValue =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    DEFAULT_SITE_URL;

  return withProtocol(envValue).replace(/\/+$/, "");
}

export function getSiteOrigin() {
  return new URL(getSiteUrl());
}
