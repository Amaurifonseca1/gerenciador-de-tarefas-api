import { Alert, Card, Spinner } from "../ui";
import { TaskFilters } from "./TaskFilters";
import { TaskPagination } from "./TaskPagination";
import { TaskStatsStrip } from "./TaskStatsStrip";
import { TaskTable } from "./TaskTable";
import type { Task, TaskListStats } from "../../types/task";

interface TaskListProps {
  tasks: Task[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    stats?: TaskListStats;
  };
  loading: boolean;
  error: string;
  filters: {
    status: string;
    priority: string;
    overdue: string;
    q: string;
    sortBy: string;
    sortOrder: string;
  };
  onFilterStatus: (value: string) => void;
  onFilterPriority: (value: string) => void;
  onFilterOverdue: (value: string) => void;
  onSearch: (value: string) => void;
  onSort: (sortBy: string, sortOrder: "asc" | "desc") => void;
  onPageChange: (page: number) => void;
  onEdit: (task: Task) => void;
  onDeleteClick: (task: Task) => void;
  onMarkDone?: (task: Task) => void;
  completingId?: number | null;
}

function hasActiveFilters(filters: TaskListProps["filters"]): boolean {
  return Boolean(filters.status || filters.priority || filters.overdue || filters.q.trim());
}

export function TaskList({
  tasks,
  meta,
  loading,
  error,
  filters,
  onFilterStatus,
  onFilterPriority,
  onFilterOverdue,
  onSearch,
  onSort,
  onPageChange,
  onEdit,
  onDeleteClick,
  onMarkDone,
  completingId,
}: TaskListProps) {
  const stats = meta.stats ?? { total: 0, completed: 0, pending: 0 };
  const filteredEmpty = tasks.length === 0 && !loading && hasActiveFilters(filters);
  const trulyEmpty = tasks.length === 0 && !loading && stats.total === 0 && !hasActiveFilters(filters);

  return (
    <Card as="section" className="task-list-card" aria-labelledby="list-heading">
      <h2 id="list-heading" className="task-list-card__title">
        Suas tarefas
      </h2>

      <TaskStatsStrip stats={stats} />

      <TaskFilters
        statusFilter={filters.status}
        priorityFilter={filters.priority}
        overdueFilter={filters.overdue}
        onStatusChange={onFilterStatus}
        onPriorityChange={onFilterPriority}
        onOverdueChange={onFilterOverdue}
        searchQuery={filters.q}
        onSearchChange={onSearch}
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder}
        onSortChange={onSort}
      />

      {error ? <Alert variant="error">{error}</Alert> : null}

      {loading ? (
        <Spinner label="Carregando tarefas..." />
      ) : trulyEmpty ? (
        <div className="task-empty" role="status">
          <span className="task-empty__icon" aria-hidden>
            📋
          </span>
          <p className="task-empty__text">Nenhuma tarefa ainda</p>
          <p className="task-empty__hint">Use o formulário de tarefas para criar sua primeira tarefa.</p>
        </div>
      ) : filteredEmpty ? (
        <div className="task-empty task-empty--muted" role="status">
          <span className="task-empty__icon" aria-hidden>
            🔍
          </span>
          <p className="task-empty__text">Nenhuma tarefa encontrada</p>
          <p className="task-empty__hint">Ajuste status, prioridade, filtro de atrasadas ou a busca por título.</p>
        </div>
      ) : (
        <>
          <TaskTable
            tasks={tasks}
            onEdit={onEdit}
            onDeleteClick={onDeleteClick}
            onMarkDone={onMarkDone}
            completingId={completingId}
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
