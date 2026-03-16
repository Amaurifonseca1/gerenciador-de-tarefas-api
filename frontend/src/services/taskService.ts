import { api } from "../lib/api";
import type { Task, TaskFormData, TasksResponse } from "../types/task";

export interface ListTasksParams {
  status?: string;
  q?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export const taskService = {
  async list(params: ListTasksParams = {}): Promise<TasksResponse> {
    const { data } = await api.get<TasksResponse>("/tasks", { params });
    return data;
  },

  async getById(id: number): Promise<Task> {
    const { data } = await api.get<{ data: Task }>(`/tasks/${id}`);
    return data.data;
  },

  async create(payload: TaskFormData): Promise<Task> {
    const { data } = await api.post<{ data: Task }>("/tasks", payload);
    return data.data;
  },

  async update(id: number, payload: TaskFormData): Promise<Task> {
    const { data } = await api.put<{ data: Task }>(`/tasks/${id}`, payload);
    return data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};
