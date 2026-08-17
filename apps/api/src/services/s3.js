const crypto = require("node:crypto");
const { HeadObjectCommand, PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const IMAGE_EXTENSIONS = {
  "image/avif": "avif",
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

class UploadInputError extends Error {
  constructor(message) {
    super(message);
    this.name = "UploadInputError";
    this.statusCode = 400;
  }
}

function normalizeContentType(contentType) {
  return contentType.split(";", 1)[0].trim().toLowerCase();
}

function assertImageInput(contentType, size, config) {
  const normalizedContentType = typeof contentType === "string" ? normalizeContentType(contentType) : "";

  if (!IMAGE_EXTENSIONS[normalizedContentType]) {
    throw new UploadInputError("Only PNG, JPEG, GIF, WebP, and AVIF images are supported.");
  }

  if (!Number.isInteger(size) || size < 1 || size > config.maxImageBytes) {
    throw new UploadInputError(`Image must be between 1 byte and ${config.maxImageBytes.toLocaleString()} bytes.`);
  }

  return normalizedContentType;
}

function createS3Service(config) {
  if (!config.imageUploadsEnabled) return null;

  const client = new S3Client({ region: config.awsRegion });
  const keyPrefix = `${config.s3PastePrefix}/`;

  function imageUrl(key) {
    return `${config.s3PublicBaseUrl}/${key.split("/").map(encodeURIComponent).join("/")}`;
  }

  function objectKey(contentType) {
    const date = new Date().toISOString().slice(0, 10);
    const token = crypto.randomBytes(18).toString("hex");
    return `${keyPrefix}${date}/${token}.${IMAGE_EXTENSIONS[contentType]}`;
  }

  return {
    async createImageUpload(contentType, size) {
      const normalizedContentType = assertImageInput(contentType, size, config);
      const key = objectKey(normalizedContentType);
      const command = new PutObjectCommand({
        Bucket: config.s3PasteBucket,
        Key: key,
        ContentType: normalizedContentType,
        CacheControl: "public, max-age=31536000, immutable",
      });
      const uploadUrl = await getSignedUrl(client, command, {
        expiresIn: config.uploadUrlTtlSeconds,
        signableHeaders: new Set(["content-type"]),
      });

      return { key, url: imageUrl(key), uploadUrl, contentType: normalizedContentType };
    },

    async verifyImage(key) {
      if (typeof key !== "string" || !key.startsWith(keyPrefix) || !/^[a-z0-9/.-]+$/.test(key)) {
        throw new UploadInputError("Invalid image upload reference.");
      }

      let object;
      try {
        object = await client.send(new HeadObjectCommand({
          Bucket: config.s3PasteBucket,
          Key: key,
        }));
      } catch {
        throw new UploadInputError("The uploaded image was not found. Upload it again and retry.");
      }
      const contentType = normalizeContentType(object.ContentType ?? "");
      const size = object.ContentLength ?? 0;

      assertImageInput(contentType, size, config);
      return { key, url: imageUrl(key), contentType, size };
    },
  };
}

module.exports = { UploadInputError, createS3Service };
