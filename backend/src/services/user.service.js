import bcrypt from "bcryptjs";
import { getDb } from "../db/database.js";

const SALT_ROUNDS = 10;

export function findUserByEmail(email) {
  const db = getDb();
  return db.prepare("SELECT id, email, password FROM users WHERE email = ? COLLATE NOCASE").get(email.trim());
}

export function createUser(email, plainPassword) {
  const db = getDb();
  const hash = bcrypt.hashSync(plainPassword, SALT_ROUNDS);
  const stmt = db.prepare(
    "INSERT INTO users (email, password, created_at, updated_at) VALUES (?, ?, datetime('now'), datetime('now'))"
  );
  const info = stmt.run(email.trim().toLowerCase(), hash);
  return { id: Number(info.lastInsertRowid), email: email.trim().toLowerCase() };
}

export function verifyPassword(plain, hash) {
  return bcrypt.compareSync(plain, hash);
}

export function getUserById(id) {
  const db = getDb();
  return db.prepare("SELECT id, email FROM users WHERE id = ?").get(id);
}
