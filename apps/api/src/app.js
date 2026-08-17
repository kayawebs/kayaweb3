const compression = require("compression");
const cors = require("cors");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoose = require("mongoose");
const { createPasteRouter } = require("./routes/pastes");

function createApp(config) {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(compression());
  app.use(cors({
    origin(origin, callback) {
      if (!origin || config.corsOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed by this API."));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    maxAge: 86_400,
  }));
  app.use(express.json({ limit: "300kb" }));
  app.use(rateLimit({ windowMs: 60 * 1000, limit: 120, standardHeaders: "draft-8", legacyHeaders: false }));

  app.get("/v1/health", (_req, res) => {
    const databaseReady = mongoose.connection.readyState === 1;
    res.status(databaseReady ? 200 : 503).json({
      status: databaseReady ? "ok" : "degraded",
      database: databaseReady ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    });
  });
  app.use("/v1", createPasteRouter(config));

  app.use((_req, res) => res.status(404).json({ error: "Route not found." }));
  app.use((error, _req, res, _next) => {
    const status = error.statusCode ?? (error.type === "entity.too.large" ? 413 : 500);
    if (status >= 500) console.error(error);
    res.status(status).json({ error: status === 413 ? "Request body is too large." : error.message ?? "Unexpected server error." });
  });

  return app;
}

module.exports = { createApp };
