const Paste = require("../models/Paste");
const { generateCode, isValidCustomCode } = require("../utils/code");

function formatPaste(paste, publicWebUrl) {
  return {
    code: paste.code,
    url: `${publicWebUrl}/p/${encodeURIComponent(paste.code)}`,
    createdAt: paste.createdAt,
    expiresAt: paste.expiresAt,
  };
}

async function getAvailableCode() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generateCode();
    const existing = await Paste.exists({ code });
    if (!existing) return code;
  }

  throw new Error("Could not generate a unique paste code.");
}

function createPasteController(config) {
  return async function createPaste(req, res, next) {
    try {
      const content = typeof req.body.content === "string" ? req.body.content : "";
      const customCode = typeof req.body.customCode === "string" ? req.body.customCode.trim() : "";
      const requestedTtl = Number.parseInt(String(req.body.expiresInHours ?? ""), 10);
      const ttlHours = Number.isFinite(requestedTtl)
        ? requestedTtl
        : config.defaultTtlHours;

      if (!content.trim()) {
        return res.status(400).json({ error: "Content is required." });
      }

      if (content.length > config.maxCharacters) {
        return res.status(413).json({ error: `Content must be ${config.maxCharacters.toLocaleString()} characters or fewer.` });
      }

      if (!Number.isInteger(ttlHours) || ttlHours < 1 || ttlHours > config.maxTtlHours) {
        return res.status(400).json({ error: `expiresInHours must be between 1 and ${config.maxTtlHours}.` });
      }

      if (customCode && !isValidCustomCode(customCode)) {
        return res.status(400).json({ error: "Custom code must use 4-50 letters, numbers, underscores, or hyphens." });
      }

      const code = customCode || await getAvailableCode();
      const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

      try {
        const paste = await Paste.create({
          code,
          content,
          customCode: Boolean(customCode),
          expiresAt,
        });

        return res.status(201).json(formatPaste(paste, config.publicWebUrl));
      } catch (error) {
        if (error?.code === 11000) {
          return res.status(409).json({ error: "That custom code is already in use." });
        }
        throw error;
      }
    } catch (error) {
      return next(error);
    }
  };
}

async function findPaste(code) {
  const paste = await Paste.findOne({ code, expiresAt: { $gt: new Date() } }).lean();
  return paste;
}

function getPasteController(config) {
  return async function getPaste(req, res, next) {
    try {
      const paste = await findPaste(req.params.code);
      if (!paste) return res.status(404).json({ error: "Paste not found or expired." });
      return res.json({ ...formatPaste(paste, config.publicWebUrl), content: paste.content });
    } catch (error) {
      return next(error);
    }
  };
}

async function getRawPaste(req, res, next) {
  try {
    const paste = await findPaste(req.params.code);
    if (!paste) return res.status(404).type("text/plain").send("Paste not found or expired.");
    return res.type("text/plain; charset=utf-8").send(paste.content);
  } catch (error) {
    return next(error);
  }
}

module.exports = { createPasteController, getPasteController, getRawPaste };
