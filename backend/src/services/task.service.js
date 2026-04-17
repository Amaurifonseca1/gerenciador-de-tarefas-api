import { getDb, rowToTask, TASK_PRIORITIES, TASK_STATUSES } from "../db/database.js";

function completedFromStatus(status) {
  return status === "concluído" ? 1 : 0;
}

function assertValidStatus(status) {
  if (!TASK_STATUSES.includes(status)) {
    const err = new Error("O status selecionado é inválido.");
    err.statusCode = 422;
    throw err;
  }
}

function assertValidPriority(priority) {
  if (!TASK_PRIORITIES.includes(priority)) {
    const err = new Error("A prioridade selecionada é inválida.");
    err.statusCode = 422;
    throw err;
  }
}

function normalizeDueDate(value) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return null;
  const s = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const err = new Error("A data limite deve estar no formato AAAA-MM-DD.");
    err.statusCode = 422;
    throw err;
  }
  return s;
}

function orderClause(sortBy, sortOrder) {
  const order = sortOrder === "asc" ? "ASC" : "DESC";
  const allowed = ["created_at", "updated_at", "title", "status", "priority", "due_date", "category"];
  const col = allowed.includes(sortBy) ? sortBy : "updated_at";

  if (col === "priority") {
    return `CASE priority WHEN 'alta' THEN 3 WHEN 'media' THEN 2 WHEN 'baixa' THEN 1 ELSE 0 END ${order}`;
  }
  if (col === "due_date") {
    return `(due_date IS NULL) ASC, due_date ${order}`;
  }
  return `${col} ${order}`;
}

function parseOverdueFlag(overdue) {
  if (overdue === undefined || overdue === null || overdue === "") return false;
  const s = String(overdue).toLowerCase();
  return s === "1" || s === "true" || s === "yes";
}

export function getTaskStats(userId) {
  const db = getDb();
  const total = Number(db.prepare("SELECT COUNT(*) AS n FROM tasks WHERE user_id = ?").get(userId).n);
  const completed = Number(
    db.prepare("SELECT COUNT(*) AS n FROM tasks WHERE user_id = ? AND status = 'concluído'").get(userId).n
  );
  const pending = Math.max(0, total - completed);
  return { total, completed, pending };
}

export function listTasks(userId, { status, priority, overdue, q, sortBy, sortOrder, page, perPage }) {
  const db = getDb();
  const per = Math.min(Math.max(perPage, 5), 50);
  const p = Math.max(page, 1);
  const offset = (p - 1) * per;

  const conditions = ["user_id = ?"];
  const params = [userId];

  if (status) {
    conditions.push("status = ?");
    params.push(status);
  }

  if (priority) {
    conditions.push("priority = ?");
    params.push(priority);
  }

  if (parseOverdueFlag(overdue)) {
    conditions.push("due_date IS NOT NULL");
    conditions.push("due_date < date('now', 'localtime')");
    conditions.push("status != 'concluído'");
  }

  if (q) {
    conditions.push("title LIKE ?");
    const like = `%${String(q).replace(/%/g, "\\%")}%`;
    params.push(like);
  }

  const where = conditions.join(" AND ");
  const orderSql = orderClause(sortBy, sortOrder);

  const totalRow = db.prepare(`SELECT COUNT(*) AS n FROM tasks WHERE ${where}`).get(...params);
  const total = Number(totalRow.n);
  const lastPage = Math.max(1, Math.ceil(total / per));

  const rows = db
    .prepare(
      `SELECT id, title, description, status, priority, category, due_date, created_at, updated_at
       FROM tasks WHERE ${where}
       ORDER BY ${orderSql}
       LIMIT ? OFFSET ?`
    )
    .all(...params, per, offset);

  const stats = getTaskStats(userId);

  return {
    data: rows.map(rowToTask),
    meta: {
      current_page: p,
      last_page: lastPage,
      per_page: per,
      total,
      stats,
    },
  };
}

export function getTaskById(userId, id) {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT id, title, description, status, priority, category, due_date, created_at, updated_at
       FROM tasks WHERE id = ? AND user_id = ?`
    )
    .get(id, userId);
  return rowToTask(row);
}

export function createTask(userId, { title, description, status, priority, category, due_date }) {
  assertValidStatus(status);
  const prio = priority ?? "media";
  assertValidPriority(prio);
  const due = normalizeDueDate(due_date);
  const cat = (category ?? "").trim().slice(0, 80);

  const db = getDb();
  const desc = description ?? "";
  const completed = completedFromStatus(status);
  const info = db
    .prepare(
      `INSERT INTO tasks (user_id, title, description, status, completed, priority, category, due_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
    )
    .run(userId, title.trim(), desc, status, completed, prio, cat, due);

  return getTaskById(userId, Number(info.lastInsertRowid));
}

export function updateTask(userId, id, { title, description, status, priority, category, due_date }) {
  assertValidStatus(status);
  const prio = priority ?? "media";
  assertValidPriority(prio);
  const due = normalizeDueDate(due_date);
  const cat = (category ?? "").trim().slice(0, 80);

  const db = getDb();
  const existing = db.prepare("SELECT id FROM tasks WHERE id = ? AND user_id = ?").get(id, userId);
  if (!existing) {
    const err = new Error("Tarefa não encontrada.");
    err.statusCode = 404;
    throw err;
  }

  const desc = description ?? "";
  const completed = completedFromStatus(status);
  db.prepare(
    `UPDATE tasks SET title = ?, description = ?, status = ?, completed = ?, priority = ?, category = ?, due_date = ?, updated_at = datetime('now')
     WHERE id = ? AND user_id = ?`
  ).run(title.trim(), desc, status, completed, prio, cat, due, id, userId);

  return getTaskById(userId, id);
}

export function deleteTask(userId, id) {
  const db = getDb();
  const info = db.prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?").run(id, userId);
  if (info.changes === 0) {
    const err = new Error("Tarefa não encontrada.");
    err.statusCode = 404;
    throw err;
  }
}
