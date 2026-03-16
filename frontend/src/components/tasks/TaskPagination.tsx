interface TaskPaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function TaskPagination({
  currentPage,
  lastPage,
  total,
  onPageChange,
}: TaskPaginationProps) {
  if (lastPage <= 1) return null;

  const pages: number[] = [];
  const delta = 2;
  for (
    let i = Math.max(1, currentPage - delta);
    i <= Math.min(lastPage, currentPage + delta);
    i++
  ) {
    pages.push(i);
  }

  return (
    <nav
      className="task-pagination"
      aria-label="Paginação da lista de tarefas"
    >
      <p className="task-pagination__info">
        Página {currentPage} de {lastPage} ({total} {total === 1 ? "tarefa" : "tarefas"})
      </p>
      <ul className="task-pagination__list">
        <li>
          <button
            type="button"
            className="task-pagination__btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Página anterior"
          >
            Anterior
          </button>
        </li>
        {pages.map((page) => (
          <li key={page}>
            <button
              type="button"
              className={`task-pagination__btn ${page === currentPage ? "task-pagination__btn--current" : ""}`}
              onClick={() => onPageChange(page)}
              aria-label={`Página ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          </li>
        ))}
        <li>
          <button
            type="button"
            className="task-pagination__btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= lastPage}
            aria-label="Próxima página"
          >
            Próxima
          </button>
        </li>
      </ul>
    </nav>
  );
}
