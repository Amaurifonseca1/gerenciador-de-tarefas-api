import { useCallback, useState } from "react";
import { getApiErrorMessage } from "../lib/api";
import { taskService } from "../services/taskService";
import type { Task, TaskFormData, TaskPriority, TaskStatus } from "../types/task";

const initialForm: TaskFormData = {
  title: "",
  description: "",
  status: "pendente",
  priority: "media",
  category: "",
  due_date: "",
};

export function useTaskForm(onSuccess?: () => void) {
  const [form, setForm] = useState<TaskFormData>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const resetForm = useCallback(() => {
    setForm(initialForm);
    setEditingId(null);
  }, []);

  const setTitle = useCallback((title: string) => {
    setForm((prev) => ({ ...prev, title }));
  }, []);

  const setDescription = useCallback((description: string) => {
    setForm((prev) => ({ ...prev, description }));
  }, []);

  const setStatus = useCallback((status: TaskStatus) => {
    setForm((prev) => ({ ...prev, status }));
  }, []);

  const setPriority = useCallback((priority: TaskPriority) => {
    setForm((prev) => ({ ...prev, priority }));
  }, []);

  const setCategory = useCallback((category: string) => {
    setForm((prev) => ({ ...prev, category }));
  }, []);

  const setDueDate = useCallback((due_date: string) => {
    setForm((prev) => ({ ...prev, due_date }));
  }, []);

  const startEdit = useCallback((task: Task) => {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description ?? "",
      status: task.status as TaskStatus,
      priority: (task.priority ?? "media") as TaskPriority,
      category: task.category ?? "",
      due_date: task.due_date ?? "",
    });
    setSuccessMessage("");
    setErrorMessage("");
  }, []);

  const cancelEdit = useCallback(() => {
    resetForm();
    setSuccessMessage("");
    setErrorMessage("");
  }, [resetForm]);

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const title = form.title.trim();
      if (!title) {
        setErrorMessage("O título é obrigatório.");
        return;
      }

      setSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      try {
        const payload: TaskFormData = {
          title,
          description: form.description.trim(),
          status: form.status,
          priority: form.priority,
          category: form.category.trim(),
          due_date: form.due_date.trim(),
        };

        if (editingId) {
          await taskService.update(editingId, payload);
          setSuccessMessage("Tarefa atualizada com sucesso.");
        } else {
          await taskService.create(payload);
          setSuccessMessage("Tarefa criada com sucesso.");
        }
        resetForm();
        onSuccess?.();
      } catch (err) {
        setErrorMessage(getApiErrorMessage(err));
      } finally {
        setSubmitting(false);
      }
    },
    [form, editingId, resetForm, onSuccess]
  );

  return {
    form,
    editingId,
    submitting,
    successMessage,
    errorMessage,
    setTitle,
    setDescription,
    setStatus,
    setPriority,
    setCategory,
    setDueDate,
    startEdit,
    cancelEdit,
    submit,
    resetForm,
    setErrorMessage,
    setSuccessMessage,
  };
}
