import { api } from "../lib/api";
import type { Task, TaskFormData, TasksListApiEnvelope, TasksListResult } from "../types/task";

export interface ListTasksParams {
  status?: string;
  priority?: string;
  overdue?: string;
  q?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export const taskService = {
  async list(params: ListTasksParams = {}): Promise<TasksListResult> {
    const { data: body } = await api.get<TasksListApiEnvelope>("/tasks", { params });
    return {
      data: body.data.items,
      meta: body.data.meta,
    };
  },

  async getById(id: number): Promise<Task> {
    const { data } = await api.get<{ success?: boolean; data: Task }>(`/tasks/${id}`);
    return data.data;
  },

  async create(payload: TaskFormData): Promise<Task> {
    const requestBody = {
      ...payload,
      due_date: payload.due_date.trim() === "" ? null : payload.due_date.trim(),
    };
    const { data } = await api.post<{ success?: boolean; data: Task }>("/tasks", requestBody);
    return data.data;
  },

  async update(id: number, payload: TaskFormData): Promise<Task> {
    const requestBody = {
      ...payload,
      due_date: payload.due_date.trim() === "" ? null : payload.due_date.trim(),
    };
    const { data } = await api.put<{ success?: boolean; data: Task }>(`/tasks/${id}`, requestBody);
    return data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};
