# Gerenciador de tarefas (API + frontend)

Monorepo com **frontend React (Vite + TypeScript)** e **backend Node.js (Express + SQLite + JWT)** para cadastro, login e CRUD de tarefas por usuário. O diretório `task-manager/` contém uma API **Laravel** legada, mantida apenas como referência; a entrega principal acadêmica usa **`backend/`** + **`frontend/`**.

## Visão geral

- Autenticação **JWT** enviada no header **`Authorization: Bearer <token>`**.
- Tarefas isoladas por usuário, com **status**, **prioridade**, **categoria**, **data limite** e indicador calculado **`atrasada`** (prazo anterior à data local de hoje e status diferente de concluído).
- Listagem paginada com filtros e contadores globais em `meta.stats`.

## Tecnologias

| Camada    | Stack |
|-----------|--------|
| Frontend  | React 19, TypeScript, Vite, React Router, Axios |
| Backend   | Node.js, Express, better-sqlite3, bcryptjs, jsonwebtoken, express-validator, CORS |
| Banco     | SQLite (arquivo local, ex.: `backend/data/app.db`) |
| Testes    | Node.js test runner (`node:test`) + supertest |
| Legado    | Laravel (`task-manager/`) — opcional |

## Como rodar

### Backend

```bash
cd backend
cp .env.example .env
# Edite JWT_SECRET e, se precisar, CORS_ORIGIN (origens do Vite, separadas por vírgula)
npm install
npm run dev
```

API padrão: `http://127.0.0.1:3001/api` (porta configurável em `PORT`).

### Testes (backend)

```bash
cd backend
npm test
```

Usa SQLite **`:memory:`** e variáveis definidas em `tests/env-setup.js` (não sobrescreve seu `.env` em desenvolvimento normal).

### Frontend

```bash
cd frontend
cp .env.example .env
# VITE_API_URL deve apontar para a API Node, sem barra no final, ex.:
# VITE_API_URL=http://127.0.0.1:3001/api
npm install
npm run dev
```

## Autenticação JWT (Bearer Token)

1. Faça **POST** `/api/login` ou **POST** `/api/register` com e-mail e senha.
2. A resposta inclui `data.token` (string JWT).
3. Em todas as rotas protegidas, envie o header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. Token inválido ou ausente → **401** com corpo `{ "success": false, "message": "..." }`.
5. O frontend armazena sessão em `localStorage` e o Axios injeta o header automaticamente (`src/lib/api.ts`).

## Formato padrão de resposta da API

Todas as respostas JSON seguem o envelope:

```json
{
  "success": true | false,
  "data": {},
  "message": "string opcional",
  "errors": "objeto opcional (validação)"
}
```

- Campos omitidos quando vazios (`data` em erro simples, `errors` quando não há validação).
- **Erros 4xx/5xx:** `success: false`, `message` obrigatório; em **422** pode haver `errors` com campos e listas de mensagens (estilo Laravel).

## Exemplos de request / response

### Login

**Request**

```http
POST /api/login HTTP/1.1
Content-Type: application/json

{
  "email": "marina@example.com",
  "password": "minhasenha123"
}
```

**Response (200)**

```json
{
  "success": true,
  "data": {
    "token": "<jwt>",
    "user": { "id": 1, "email": "marina@example.com" }
  },
  "message": "Login realizado com sucesso."
}
```

**Response (401) — credenciais inválidas**

```json
{
  "success": false,
  "message": "E-mail ou senha incorretos."
}
```

### Criação de tarefa

**Request**

```http
POST /api/tasks HTTP/1.1
Content-Type: application/json
Authorization: Bearer <jwt>

{
  "title": "Entregar relatório",
  "description": "Capítulo 3 e referências",
  "status": "em andamento",
  "priority": "alta",
  "category": "Faculdade",
  "due_date": "2026-04-20"
}
```

**Response (201)**

```json
{
  "success": true,
  "data": {
    "id": 12,
    "title": "Entregar relatório",
    "description": "Capítulo 3 e referências",
    "status": "em andamento",
    "priority": "alta",
    "category": "Faculdade",
    "due_date": "2026-04-20",
    "atrasada": false,
    "created_at": "...",
    "updated_at": "..."
  },
  "message": "Tarefa criada com sucesso."
}
```

### Listagem de tarefas

**Request**

```http
GET /api/tasks?page=1&per_page=15&sort_by=due_date&sort_order=asc&overdue=1 HTTP/1.1
Authorization: Bearer <jwt>
```

- `overdue=1` ou `overdue=true`: apenas tarefas com `due_date` anterior à **data local de hoje** e **não concluídas**.

**Response (200)**

```json
{
  "success": true,
  "data": {
    "items": [ { "id": 1, "title": "...", "atrasada": true, "...": "..." } ],
    "meta": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 15,
      "total": 3,
      "stats": { "total": 10, "completed": 4, "pending": 6 }
    }
  }
}
```

## Rotas da API (`/api`)

| Método | Rota | Autenticação | Descrição |
|--------|------|----------------|-----------|
| POST | `/register` | Não | Cadastro (`email`, `password`) |
| POST | `/login` | Não | Login |
| GET | `/me` | Sim | `{ data: { user: { id, email } } }` |
| GET | `/tasks` | Sim | Lista: query `status`, `priority`, `overdue`, `q`, `sort_by`, `sort_order`, `page`, `per_page` |
| GET | `/tasks/:id` | Sim | Detalhe |
| POST | `/tasks` | Sim | Criar |
| PUT | `/tasks/:id` | Sim | Atualizar |
| DELETE | `/tasks/:id` | Sim | Excluir → `{ success, message }` (sem `data`) |

**GET** `/health` (fora de `/api`): `{ "success": true, "data": { "ok": true, "service": "..." } }`.

## Estrutura de pastas (principais)

```
gerenciador-de-tarefas-api/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config.js
│   │   ├── db/database.js
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── middleware/        # requireAuth (JWT), validação, errorHandler
│   │   └── utils/response.js  # sendResponse, sendSuccess, sendError, …
│   ├── tests/
│   │   ├── env-setup.js
│   │   └── api.integration.test.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/tasks/
│   │   ├── components/ui/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── lib/
│   │   └── types/
│   ├── package.json
│   └── .env.example
├── task-manager/
├── ENTREGA-ACADEMICA.md
└── README.md
```

## Documentação adicional

- `ENTREGA-ACADEMICA.md` — contexto de negócio, persona, jornada, UX e funcionalidades.
- `REFATORACAO.md` — histórico Laravel + frontend.
