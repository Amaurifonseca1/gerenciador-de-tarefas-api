import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const rootDir = path.join(__dirname, "..");

function resolveDatabasePath(raw) {
  if (!raw) return path.join(rootDir, "data", "app.db");
  if (raw === ":memory:" || raw.startsWith("file:")) return raw;
  return path.isAbsolute(raw) ? raw : path.join(rootDir, raw);
}

export const config = {
  port: Number(process.env.PORT) || 3001,
  jwtSecret: process.env.JWT_SECRET || "dev-only-change-me",
  databasePath: resolveDatabasePath(process.env.DATABASE_PATH),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
};
