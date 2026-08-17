const express = require("express");
const rateLimit = require("express-rate-limit");
const { createImageUploadController, createPasteController, getPasteController, getRawPaste } = require("../controllers/pasteController");
const { createS3Service } = require("../services/s3");

function createPasteRouter(config) {
  const router = express.Router();
  const s3Service = createS3Service(config);
  const createLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 15,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Too many paste requests. Try again in a minute." },
  });

  const uploadLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 15,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Too many upload requests. Try again in a minute." },
  });

  router.post("/uploads/images", uploadLimiter, createImageUploadController(config, s3Service));
  router.post("/pastes", createLimiter, createPasteController(config, s3Service));
  router.get("/pastes/:code", getPasteController(config));
  router.get("/pastes/:code/raw", getRawPaste);

  return router;
}

module.exports = { createPasteRouter };
