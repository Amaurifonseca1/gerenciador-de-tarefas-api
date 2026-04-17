import { createApp } from "./app.js";
import { config } from "./config.js";
import { initDatabase } from "./db/database.js";

initDatabase();

const app = createApp();

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`API em http://127.0.0.1:${config.port}/api`);
});
