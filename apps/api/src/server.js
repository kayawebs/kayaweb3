require("dotenv").config();

const { createApp } = require("./app");
const { connectDatabase } = require("./config/database");
const { getEnv } = require("./config/env");

async function start() {
  const config = getEnv();
  await connectDatabase(config.mongoUri);

  const app = createApp(config);
  app.listen(config.port, () => {
    console.log(`Kaya API listening on :${config.port}`);
  });
}

start().catch((error) => {
  console.error("Kaya API failed to start", error);
  process.exit(1);
});
