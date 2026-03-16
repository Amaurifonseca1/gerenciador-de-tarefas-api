import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "../lib/api";
import { taskService } from "../services/taskService";
import type { Task } from "../types/task";

export interface UseTasksFilters {
  status: string;
  q: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
  perPage: number;
}

const defaultFilters: UseTasksFilters = {
  status: "",
  q: "",
  sortBy: "updated_at",
  sortOrder: "desc",
  page: 1,
  perPage: 15,
};

export function useTasks(initialFilters?: Partial<UseTasksFilters>) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState<UseTasksFilters>({
    ...defaultFilters,
    ...initialFilters,
  });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await taskService.list({
        status: filters.status || undefined,
        q: filters.q || undefined,
        sort_by: filters.sortBy,
        sort_order: filters.sortOrder,
        page: filters.page,
        per_page: filters.perPage,
      });
      setTasks(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.q, filters.sortBy, filters.sortOrder, filters.page, filters.perPage]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const setFilterStatus = useCallback((status: string) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  }, []);

  const setSearch = useCallback((q: string) => {
    setFilters((prev) => ({ ...prev, q, page: 1 }));
  }, []);

  const setSort = useCallback((sortBy: string, sortOrder: "asc" | "desc") => {
    setFilters((prev) => ({ ...prev, sortBy, sortOrder, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const deleteTask = useCallback(async (id: number) => {
    setError("");
    try {
      await taskService.delete(id);
      await fetchTasks();
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err));
      return false;
    }
  }, [fetchTasks]);

  return {
    tasks,
    meta,
    loading,
    error,
    filters,
    setFilterStatus,
    setSearch,
    setSort,
    setPage,
    deleteTask,
    refetch: fetchTasks,
  };
}
