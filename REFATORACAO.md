# Refatoração Completa - Gerenciador de Tarefas

## 1. Análise dos problemas encontrados

### Backend (antes)
- Validação feita direto no controller com regras repetidas.
- Sem Form Requests dedicados; mensagens de erro em inglês.
- Respostas JSON inconsistentes (às vezes só o model, às vezes com `message`).
- Sem paginação, busca ou ordenação.
- Constantes de status espalhadas como string no controller.
- Sem camada de Resource para padronizar o formato da API.

### Frontend (antes)
- Toda a lógica no `App.tsx` (estado, API, handlers).
- Uso de `window.confirm` para exclusão.
- Sem busca, ordenação ou paginação.
- Componentes acoplados; poucos reutilizáveis.
- API client e tipos em poucos arquivos; sem serviço dedicado.
- Falta de acessibilidade (labels, roles, aria).

### Estrutura (antes)
- Componentes em `components/` sem agrupamento por feature.
- Sem hooks customizados nem camada de serviços.
- CSS monolítico com nomes genéricos (task-*).

---

## 2. O que foi feito

### Backend

| Item | Melhoria |
|------|----------|
| **Form Requests** | `StoreTaskRequest`, `UpdateTaskRequest`, `ListTasksRequest` com regras e mensagens em português. |
| **TaskResource** | Respostas padronizadas: `{ data: Task }` ou `{ data: [], meta: {} }`. |
| **Task (Model)** | Constantes `STATUSES`, `STATUS_PENDING`, etc.; `$fillable` e `$casts` definidos. |
| **TaskController** | Uso de Form Requests, TaskResource, injeção de `Task` (route model binding). |
| **Index (listagem)** | Filtro por status, busca (`q`), ordenação (`sort_by`, `sort_order`), paginação (`per_page`, `page`). |
| **Rotas** | `Route::apiResource('tasks', TaskController::class)` (REST completo). |
| **Validação** | Título obrigatório e limite; descrição opcional com máximo; status com lista fixa. |

### Frontend

| Item | Melhoria |
|------|----------|
| **Estrutura** | `lib/api.ts`, `services/taskService.ts`, `hooks/useTasks.ts`, `hooks/useTaskForm.ts`. |
| **UI** | Componentes em `components/ui/`: Button, Input, Textarea, Select, Card, Badge, Alert, Spinner, Modal, ConfirmModal. |
| **Tasks** | Componentes em `components/tasks/`: TaskForm, TaskFilters, TaskTable, TaskPagination, TaskList. |
| **Estado** | `useTasks` (lista, filtros, paginação, delete, refetch) e `useTaskForm` (formulário, edição, submit). |
| **API** | `taskService` com métodos tipados; respostas com `data` e `meta` para listagem. |
| **Exclusão** | Modal de confirmação (ConfirmModal) em vez de `window.confirm`. |
| **Busca** | Campo “Buscar” por título/descrição. |
| **Ordenação** | Select “Ordenar por” + botão para asc/desc. |
| **Paginação** | Controles e texto “Página X de Y (N tarefas)”. |
| **Acessibilidade** | Labels, `aria-*`, `role`, `.visually-hidden`, foco no modal. |
| **Tipos** | `Task`, `TaskStatus`, `TaskFormData`, `TasksResponse`, `STATUS_OPTIONS`. |

### Estrutura de pastas (frontend)

```
src/
├── components/
│   ├── ui/           # Button, Input, Select, Card, Badge, Alert, Spinner, Modal
│   └── tasks/        # TaskForm, TaskFilters, TaskTable, TaskPagination, TaskList
├── hooks/
│   ├── useTasks.ts   # Lista, filtros, paginação, delete
│   └── useTaskForm.ts # Formulário, edição, submit
├── lib/
│   └── api.ts        # Cliente axios + getApiErrorMessage
├── services/
│   └── taskService.ts # Chamadas à API de tarefas
├── types/
│   └── task.ts       # Tipos e constantes de tarefa
├── App.tsx
├── App.css
└── main.tsx
```

### Arquivos removidos (frontend)

- `src/api/client.ts` → substituído por `src/lib/api.ts`
- `src/components/TaskForm.tsx` → `src/components/tasks/TaskForm.tsx`
- `src/components/TaskTable.tsx` → `src/components/tasks/TaskTable.tsx`
- `src/components/StatusFilter.tsx` → lógica em `TaskFilters.tsx`

---

## 3. Como rodar

### Backend (Laravel)

```bash
cd task-manager
cp .env.example .env   # se ainda não tiver .env
php artisan key:generate
php artisan migrate
php artisan serve
```

API em `http://127.0.0.1:8000`. Rotas em `routes/api.php` (prefixo `api`).

### Frontend (Vite)

```bash
cd frontend
npm install
# Opcional: criar .env com VITE_API_URL=http://127.0.0.1:8000/api
npm run dev
```

Acesse a URL indicada pelo Vite (ex.: `http://localhost:5173`).

---

## 4. Funcionalidades garantidas

- Criar tarefa (título, descrição, status).
- Listar tarefas (com paginação).
- Filtrar por status.
- Buscar por título ou descrição.
- Ordenar por data de atualização, criação, título ou status (asc/desc).
- Editar tarefa (formulário preenchido ao clicar em “Editar”).
- Excluir tarefa (modal de confirmação).
- Mensagens de sucesso e erro (incluindo validação do backend).
- Estados de loading e lista vazia.
- Layout responsivo (desktop e mobile).

---

## 5. Qualidade de código

- **Backend:** Form Requests, Resource, constantes no model, controller enxuto, validação e mensagens em português.
- **Frontend:** Hooks e serviços separados, componentes UI reutilizáveis, tipos TypeScript, tratamento de erro da API.
- **Consistência:** Respostas JSON padronizadas, status HTTP adequados, nomenclatura clara.
- **Manutenção:** Responsabilidades bem separadas; fácil estender filtros, campos ou novos endpoints.
