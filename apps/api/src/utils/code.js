const { randomBytes } = require("node:crypto");
const customCodePattern = /^[a-zA-Z0-9_-]{4,50}$/;

function generateCode() {
  return randomBytes(8).toString("base64url");
}

function isValidCustomCode(value) {
  return customCodePattern.test(value);
}

module.exports = { generateCode, isValidCustomCode };
