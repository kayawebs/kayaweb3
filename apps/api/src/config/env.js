const defaultOrigins = ["https://kayaweb3.xyz", "https://www.kayaweb3.xyz"];

function integerFromEnv(name, fallback) {
  const value = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function getEnv() {
  const configuredOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
    : defaultOrigins;

  return {
    port: integerFromEnv("PORT", 4000),
    mongoUri: process.env.MONGODB_URI,
    publicWebUrl: (process.env.PUBLIC_WEB_URL ?? "https://www.kayaweb3.xyz").replace(/\/+$/, ""),
    corsOrigins: configuredOrigins,
    defaultTtlHours: integerFromEnv("PASTE_DEFAULT_TTL_HOURS", 24),
    maxTtlHours: integerFromEnv("PASTE_MAX_TTL_HOURS", 168),
    maxCharacters: integerFromEnv("PASTE_MAX_CHARACTERS", 250000),
  };
}

module.exports = { getEnv };
