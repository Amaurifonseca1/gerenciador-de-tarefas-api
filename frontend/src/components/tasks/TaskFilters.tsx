import { Select } from "../ui";
import { STATUS_OPTIONS } from "../../types/task";

interface TaskFiltersProps {
  statusFilter: string;
  onStatusChange: (value: string) => void;
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
];

export function TaskFilters({
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
}: TaskFiltersProps) {
  const allStatusOptions = [{ value: "", label: "Todos os status" }, ...STATUS_OPTIONS];

  return (
    <div className="task-filters" role="search">
      <div className="task-filters__row">
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
      <div className="task-filters__row task-filters__search">
        <label htmlFor="filter-search" className="task-filters__label">
          Buscar
        </label>
        <input
          id="filter-search"
          type="search"
          placeholder="Título ou descrição..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="form-field__input task-filters__input"
          aria-label="Buscar tarefas por título ou descrição"
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
            onClick={() =>
              onSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc")
            }
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
