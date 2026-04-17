export type TaskStatus = "pendente" | "em andamento" | "concluído";
export type TaskPriority = "baixa" | "media" | "alta";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  due_date: string | null;
  /** Calculada na API: prazo &lt; hoje e não concluída. */
  atrasada?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const TASK_STATUSES: TaskStatus[] = ["pendente", "em andamento", "concluído"];
export const TASK_PRIORITIES: TaskPriority[] = ["baixa", "media", "alta"];

export const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "pendente", label: "Pendente" },
  { value: "em andamento", label: "Em andamento" },
  { value: "concluído", label: "Concluído" },
];

export const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "baixa", label: "Baixa" },
  { value: "media", label: "Média" },
  { value: "alta", label: "Alta" },
];

export const OVERDUE_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Todas as tarefas" },
  { value: "1", label: "Somente atrasadas" },
];

export interface TaskListStats {
  total: number;
  completed: number;
  pending: number;
}

export interface TasksListMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  stats?: TaskListStats;
}

/** Resposta bruta de GET /tasks (envelope da API). */
export interface TasksListApiEnvelope {
  success: boolean;
  data: {
    items: Task[];
    meta: TasksListMeta;
  };
  message?: string;
}

/** Formato normalizado usado pelos hooks após o taskService. */
export interface TasksListResult {
  data: Task[];
  meta: TasksListMeta;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  due_date: string;
}
