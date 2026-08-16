const mongoose = require("mongoose");

async function connectDatabase(mongoUri) {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is required.");
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10_000,
  });
}

module.exports = { connectDatabase };
