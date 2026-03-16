import { useCallback, useState } from "react";
import { useTasks } from "./hooks/useTasks";
import { useTaskForm } from "./hooks/useTaskForm";
import { TaskForm } from "./components/tasks/TaskForm";
import { TaskList } from "./components/tasks/TaskList";
import { ConfirmModal } from "./components/ui";
import type { Task } from "./types/task";
import "./App.css";

function App() {
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    tasks,
    meta,
    loading,
    error: listError,
    filters,
    setFilterStatus,
    setSearch,
    setSort,
    setPage,
    deleteTask,
    refetch,
  } = useTasks();

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
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  }, [taskToDelete, deleteTask, setSuccessMessage]);

  const handleCloseDeleteModal = useCallback(() => {
    if (!deleteLoading) setTaskToDelete(null);
  }, [deleteLoading]);

  return (
    <div className="app" role="application" aria-label="Gerenciador de tarefas">
      <header className="app__header">
        <h1 className="app__title">Gerenciador de tarefas</h1>
        <p className="app__subtitle">
          Organize suas tarefas por status, busque e mantenha tudo em dia.
        </p>
      </header>

      <main className="app__main">
        <TaskForm
          title={form.title}
          description={form.description}
          status={form.status}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onStatusChange={setStatus}
          onSubmit={submit}
          onCancelEdit={cancelEdit}
          editingId={editingId}
          submitting={submitting}
          successMessage={successMessage}
          errorMessage={errorMessage}
        />

        <TaskList
          tasks={tasks}
          meta={meta}
          loading={loading}
          error={listError}
          filters={{
            status: filters.status,
            q: filters.q,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
          }}
          onFilterStatus={setFilterStatus}
          onSearch={setSearch}
          onSort={setSort}
          onPageChange={setPage}
          onEdit={startEdit}
          onDeleteClick={handleDeleteClick}
        />
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

export default App;
