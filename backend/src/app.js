import express from "express";
import cors from "cors";
import { config } from "./config.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { sendSuccess } from "./utils/response.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: config.corsOrigin.split(",").map((s) => s.trim()),
      credentials: true,
    })
  );
  app.use(express.json());

  app.get("/health", (req, res) => {
    return sendSuccess(res, { ok: true, service: "gerenciador-de-tarefas-api" });
  });

  app.use("/api", routes);

  app.use(errorHandler);

  return app;
}
