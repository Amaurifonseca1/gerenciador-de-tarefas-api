import assert from "node:assert";
import { before, describe, it } from "node:test";
import request from "supertest";
import { initDatabase } from "../src/db/database.js";
import { createApp } from "../src/app.js";

describe("API (integração)", () => {
  let app;
  const email = `user_${Date.now()}@test.local`;
  const password = "secret123";
  let token = "";

  before(() => {
    initDatabase();
    app = createApp();
  });

  it("POST /api/register retorna envelope com token", async () => {
    const res = await request(app).post("/api/register").send({ email, password });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data?.token);
    assert.strictEqual(res.body.data?.user?.email, email.toLowerCase());
    assert.ok(res.body.message);
    token = res.body.data.token;
  });

  it("POST /api/login sucesso", async () => {
    const res = await request(app).post("/api/login").send({ email, password });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data?.token);
    assert.strictEqual(res.body.data?.user?.email, email.toLowerCase());
    token = res.body.data.token;
  });

  it("POST /api/login erro (credenciais inválidas)", async () => {
    const res = await request(app).post("/api/login").send({ email, password: "wrong-pass" });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message);
  });

  it("POST /api/tasks cria tarefa autenticado", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Tarefa de teste",
        description: "Descrição",
        status: "pendente",
        priority: "media",
        category: "Testes",
        due_date: "2099-01-01",
      });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.title, "Tarefa de teste");
    assert.strictEqual(res.body.data.atrasada, false);
    assert.ok(res.body.message);
  });

  it("GET /api/tasks autenticado retorna items + meta", async () => {
    const res = await request(app).get("/api/tasks").set("Authorization", `Bearer ${token}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data.items));
    assert.ok(res.body.data.meta);
    assert.strictEqual(typeof res.body.data.meta.total, "number");
    assert.ok(res.body.data.meta.stats);
  });
});
