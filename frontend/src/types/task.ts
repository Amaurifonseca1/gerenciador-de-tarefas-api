export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  created_at?: string;
  updated_at?: string;
}

export type TaskStatus = "pendente" | "em andamento" | "concluído";

export const TASK_STATUSES: TaskStatus[] = ["pendente", "em andamento", "concluído"];

export const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "pendente", label: "Pendente" },
  { value: "em andamento", label: "Em andamento" },
  { value: "concluído", label: "Concluído" },
];

export interface TasksResponse {
  data: Task[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
}
