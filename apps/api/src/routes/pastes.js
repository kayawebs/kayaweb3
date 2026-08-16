const express = require("express");
const rateLimit = require("express-rate-limit");
const { createPasteController, getPasteController, getRawPaste } = require("../controllers/pasteController");

function createPasteRouter(config) {
  const router = express.Router();
  const createLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 15,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Too many paste requests. Try again in a minute." },
  });

  router.post("/pastes", createLimiter, createPasteController(config));
  router.get("/pastes/:code", getPasteController(config));
  router.get("/pastes/:code/raw", getRawPaste);

  return router;
}

module.exports = { createPasteRouter };
