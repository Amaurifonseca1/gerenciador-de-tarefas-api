import { Alert, Card, Spinner } from "../ui";
import { TaskFilters } from "./TaskFilters";
import { TaskTable } from "./TaskTable";
import { TaskPagination } from "./TaskPagination";
import type { Task } from "../../types/task";

interface TaskListProps {
  tasks: Task[];
  meta: { current_page: number; last_page: number; total: number };
  loading: boolean;
  error: string;
  filters: {
    status: string;
    q: string;
    sortBy: string;
    sortOrder: string;
  };
  onFilterStatus: (value: string) => void;
  onSearch: (value: string) => void;
  onSort: (sortBy: string, sortOrder: "asc" | "desc") => void;
  onPageChange: (page: number) => void;
  onEdit: (task: Task) => void;
  onDeleteClick: (task: Task) => void;
}

export function TaskList({
  tasks,
  meta,
  loading,
  error,
  filters,
  onFilterStatus,
  onSearch,
  onSort,
  onPageChange,
  onEdit,
  onDeleteClick,
}: TaskListProps) {
  return (
    <Card as="section" className="task-list-card" aria-labelledby="list-heading">
      <h2 id="list-heading" className="task-list-card__title">
        Suas tarefas
      </h2>

      <TaskFilters
        statusFilter={filters.status}
        onStatusChange={onFilterStatus}
        searchQuery={filters.q}
        onSearchChange={onSearch}
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder}
        onSortChange={onSort}
      />

      {error && (
        <Alert variant="error">{error}</Alert>
      )}

      {loading ? (
        <Spinner label="Carregando tarefas..." />
      ) : tasks.length === 0 ? (
        <div className="task-empty" role="status">
          <span className="task-empty__icon" aria-hidden>
            📋
          </span>
          <p className="task-empty__text">Nenhuma tarefa encontrada.</p>
          <p className="task-empty__hint">
            Ajuste os filtros ou crie uma nova tarefa acima.
          </p>
        </div>
      ) : (
        <>
          <TaskTable
            tasks={tasks}
            onEdit={onEdit}
            onDeleteClick={onDeleteClick}
          />
          <TaskPagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            total={meta.total}
            onPageChange={onPageChange}
          />
        </>
      )}
    </Card>
  );
}
