import { Select } from "../ui";
import { OVERDUE_FILTER_OPTIONS, PRIORITY_OPTIONS, STATUS_OPTIONS } from "../../types/task";

interface TaskFiltersProps {
  statusFilter: string;
  priorityFilter: string;
  overdueFilter: string;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onOverdueChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  sortOrder: string;
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

const sortOptions = [
  { value: "updated_at", label: "Última atualização" },
  { value: "created_at", label: "Data de criação" },
  { value: "title", label: "Título" },
  { value: "status", label: "Status" },
  { value: "priority", label: "Prioridade" },
  { value: "due_date", label: "Data limite" },
  { value: "category", label: "Categoria" },
];

export function TaskFilters({
  statusFilter,
  priorityFilter,
  overdueFilter,
  onStatusChange,
  onPriorityChange,
  onOverdueChange,
  searchQuery,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
}: TaskFiltersProps) {
  const allStatusOptions = [{ value: "", label: "Todos os status" }, ...STATUS_OPTIONS];
  const allPriorityOptions = [{ value: "", label: "Todas as prioridades" }, ...PRIORITY_OPTIONS];

  return (
    <div className="task-filters" role="search">
      <div className="task-filters__row task-filters__row--grow">
        <label htmlFor="filter-status" className="task-filters__label">
          Status
        </label>
        <Select
          id="filter-status"
          label=""
          options={allStatusOptions}
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="task-filters__select"
        />
      </div>
      <div className="task-filters__row task-filters__row--grow">
        <label htmlFor="filter-priority" className="task-filters__label">
          Prioridade
        </label>
        <Select
          id="filter-priority"
          label=""
          options={allPriorityOptions}
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="task-filters__select"
        />
      </div>
      <div className="task-filters__row task-filters__row--grow">
        <label htmlFor="filter-overdue" className="task-filters__label">
          Prazo
        </label>
        <Select
          id="filter-overdue"
          label=""
          options={OVERDUE_FILTER_OPTIONS}
          value={overdueFilter}
          onChange={(e) => onOverdueChange(e.target.value)}
          className="task-filters__select"
        />
      </div>
      <div className="task-filters__row task-filters__row--search">
        <label htmlFor="filter-search" className="task-filters__label">
          Buscar por título
        </label>
        <input
          id="filter-search"
          type="search"
          placeholder="Digite parte do título..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="form-field__input task-filters__input"
          aria-label="Buscar tarefas por título"
        />
      </div>
      <div className="task-filters__row">
        <label htmlFor="filter-sort" className="task-filters__label">
          Ordenar por
        </label>
        <div className="task-filters__sort">
          <Select
            id="filter-sort"
            label=""
            options={sortOptions}
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value, sortOrder as "asc" | "desc")}
            className="task-filters__select"
          />
          <button
            type="button"
            className="task-filters__order"
            onClick={() => onSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc")}
            aria-label={sortOrder === "asc" ? "Ordenar decrescente" : "Ordenar crescente"}
            title={sortOrder === "asc" ? "Descendente" : "Ascendente"}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>
    </div>
  );
}
