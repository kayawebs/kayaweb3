const mongoose = require("mongoose");

const pasteSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    content: {
      type: String,
      default: "",
    },
    image: {
      key: String,
      url: String,
      contentType: String,
      size: Number,
    },
    customCode: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

module.exports = mongoose.model("Paste", pasteSchema);
