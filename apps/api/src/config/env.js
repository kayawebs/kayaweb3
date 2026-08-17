const defaultOrigins = ["https://kayaweb3.xyz", "https://www.kayaweb3.xyz"];

function integerFromEnv(name, fallback) {
  const value = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function normalizedPrefix(value) {
  const prefix = (value ?? "pastes")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\/+/g, "/");
  return prefix || "pastes";
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
    awsRegion: process.env.AWS_REGION,
    s3PasteBucket: process.env.S3_PASTE_BUCKET,
    s3PastePrefix: normalizedPrefix(process.env.S3_PASTE_PREFIX),
    s3PublicBaseUrl: (process.env.S3_PUBLIC_BASE_URL ?? "").replace(/\/+$/, ""),
    maxImageBytes: integerFromEnv("PASTE_MAX_IMAGE_BYTES", 10 * 1024 * 1024),
    uploadUrlTtlSeconds: integerFromEnv("S3_UPLOAD_URL_TTL_SECONDS", 300),
    imageUploadsEnabled: Boolean(
      process.env.AWS_REGION
      && process.env.S3_PASTE_BUCKET
      && process.env.S3_PUBLIC_BASE_URL,
    ),
  };
}

module.exports = { getEnv };
