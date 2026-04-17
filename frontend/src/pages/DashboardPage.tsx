import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../hooks/useTasks";
import { useTaskForm } from "../hooks/useTaskForm";
import { TaskForm } from "../components/tasks/TaskForm";
import { TaskList } from "../components/tasks/TaskList";
import { Alert, ConfirmModal } from "../components/ui";
import { getApiErrorMessage } from "../lib/api";
import { taskService } from "../services/taskService";
import type { Task } from "../types/task";
import "../App.css";

type LocationState = { welcome?: boolean; loginOk?: boolean } | null;

export default function DashboardPage() {
  const { session, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [markDoneError, setMarkDoneError] = useState("");
  const [sessionBanner, setSessionBanner] = useState("");

  const {
    tasks,
    meta,
    loading,
    error: listError,
    filters,
    setFilterStatus,
    setFilterPriority,
    setFilterOverdue,
    setSearch,
    setSort,
    setPage,
    deleteTask,
    refetch,
  } = useTasks();

  useEffect(() => {
    const st = location.state as LocationState;
    if (!st || (!st.welcome && !st.loginOk)) return;
    if (st.welcome) setSessionBanner("Conta criada com sucesso. Bem-vindo(a)!");
    else if (st.loginOk) setSessionBanner("Login realizado com sucesso.");
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    if (!sessionBanner) return;
    const t = window.setTimeout(() => setSessionBanner(""), 6000);
    return () => window.clearTimeout(t);
  }, [sessionBanner]);

  const onFormSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const {
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
    setSuccessMessage,
  } = useTaskForm(onFormSuccess);

  const handleDeleteClick = useCallback((task: Task) => {
    setTaskToDelete(task);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!taskToDelete) return;
    setDeleteLoading(true);
    const ok = await deleteTask(taskToDelete.id);
    setDeleteLoading(false);
    if (ok) {
      setTaskToDelete(null);
      setSuccessMessage("Tarefa excluída com sucesso.");
      window.setTimeout(() => setSuccessMessage(""), 4000);
    }
  }, [taskToDelete, deleteTask, setSuccessMessage]);

  const handleCloseDeleteModal = useCallback(() => {
    if (!deleteLoading) setTaskToDelete(null);
  }, [deleteLoading]);

  const handleMarkDone = useCallback(
    async (task: Task) => {
      if (task.status === "concluído") return;
      setMarkDoneError("");
      setCompletingId(task.id);
      try {
        await taskService.update(task.id, {
          title: task.title,
          description: task.description ?? "",
          status: "concluído",
          priority: task.priority ?? "media",
          category: task.category ?? "",
          due_date: task.due_date ? task.due_date : "",
        });
        await refetch();
        setSuccessMessage("Tarefa marcada como concluída.");
        window.setTimeout(() => setSuccessMessage(""), 4000);
      } catch (err) {
        setMarkDoneError(getApiErrorMessage(err));
      } finally {
        setCompletingId(null);
      }
    },
    [refetch, setSuccessMessage]
  );

  return (
    <div className="app" role="application" aria-label="Gerenciador de tarefas">
      <header className="app__header">
        <div className="app__toolbar">
          <span className="app__user" title={session?.user.email}>
            {session?.user.email}
          </span>
          <button type="button" className="app__logout" onClick={logout}>
            Sair
          </button>
        </div>
        <h1 className="app__title">Gerenciador de tarefas</h1>
        <p className="app__subtitle">
          Organize prioridades, prazos e categorias em um só lugar.
        </p>
      </header>

      <main className="app__main app__main--dashboard">
        {sessionBanner ? (
          <Alert variant="success" role="status">
            {sessionBanner}
          </Alert>
        ) : null}

        {markDoneError ? <Alert variant="error">{markDoneError}</Alert> : null}

        <div className="dashboard-grid">
          <section className="dashboard-grid__form" aria-label="Formulário de tarefa">
            <TaskForm
              title={form.title}
              description={form.description}
              status={form.status}
              priority={form.priority}
              category={form.category}
              due_date={form.due_date}
              onTitleChange={setTitle}
              onDescriptionChange={setDescription}
              onStatusChange={setStatus}
              onPriorityChange={setPriority}
              onCategoryChange={setCategory}
              onDueDateChange={setDueDate}
              onSubmit={submit}
              onCancelEdit={cancelEdit}
              editingId={editingId}
              submitting={submitting}
              successMessage={successMessage}
              errorMessage={errorMessage}
            />
          </section>

          <section className="dashboard-grid__list" aria-label="Lista e filtros">
            <TaskList
              tasks={tasks}
              meta={meta}
              loading={loading}
              error={listError}
              filters={{
                status: filters.status,
                priority: filters.priority,
                overdue: filters.overdue,
                q: filters.q,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
              }}
              onFilterStatus={setFilterStatus}
              onFilterPriority={setFilterPriority}
              onFilterOverdue={setFilterOverdue}
              onSearch={setSearch}
              onSort={setSort}
              onPageChange={setPage}
              onEdit={startEdit}
              onDeleteClick={handleDeleteClick}
              onMarkDone={handleMarkDone}
              completingId={completingId}
            />
          </section>
        </div>
      </main>

      <ConfirmModal
        isOpen={!!taskToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Excluir tarefa"
        message={
          taskToDelete
            ? `Tem certeza que deseja excluir "${taskToDelete.title}"? Esta ação não pode ser desfeita.`
            : ""
        }
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        variant="danger"
        isLoading={deleteLoading}
      />
    </div>
  );
}
