import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { config } from "../config.js";

let db;

export const TASK_STATUSES = ["pendente", "em andamento", "concluído"];
export const TASK_PRIORITIES = ["baixa", "media", "alta"];

export function getDb() {
  if (!db) {
    throw new Error("Banco de dados não inicializado. Chame initDatabase() primeiro.");
  }
  return db;
}

/** Data local (AAAA-MM-DD) para comparar com due_date. */
export function localTodayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function computeAtrasada(row) {
  if (!row?.due_date || row.status === "concluído") return false;
  return String(row.due_date) < localTodayISO();
}

function migrateTasksTable(d) {
  const cols = d.prepare("PRAGMA table_info(tasks)").all();
  const names = new Set(cols.map((c) => c.name));
  if (!names.has("priority")) {
    d.exec("ALTER TABLE tasks ADD COLUMN priority TEXT NOT NULL DEFAULT 'media'");
  }
  if (!names.has("category")) {
    d.exec("ALTER TABLE tasks ADD COLUMN category TEXT NOT NULL DEFAULT ''");
  }
  if (!names.has("due_date")) {
    d.exec("ALTER TABLE tasks ADD COLUMN due_date TEXT NULL");
  }
}

export function initDatabase() {
  const dir = path.dirname(config.databasePath);
  fs.mkdirSync(dir, { recursive: true });

  db = new Database(config.databasePath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pendente',
      completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_updated_at ON tasks(updated_at);
  `);

  migrateTasksTable(db);

  return db;
}

export function rowToTask(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    status: row.status,
    priority: row.priority ?? "media",
    category: row.category ?? "",
    due_date: row.due_date ?? null,
    atrasada: computeAtrasada(row),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
