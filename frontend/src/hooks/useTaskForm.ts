import { useCallback, useState } from "react";
import { getApiErrorMessage } from "../lib/api";
import { taskService } from "../services/taskService";
import type { Task, TaskFormData, TaskStatus } from "../types/task";

const initialForm: TaskFormData = {
  title: "",
  description: "",
  status: "pendente",
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

  const startEdit = useCallback((task: Task) => {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description ?? "",
      status: task.status as TaskStatus,
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
        const payload: TaskFormData = { title, description: form.description.trim(), status: form.status };

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
    startEdit,
    cancelEdit,
    submit,
    resetForm,
    setErrorMessage,
    setSuccessMessage,
  };
}
