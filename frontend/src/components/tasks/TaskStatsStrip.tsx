import type { TaskListStats } from "../../types/task";

interface TaskStatsStripProps {
  stats: TaskListStats;
}

export function TaskStatsStrip({ stats }: TaskStatsStripProps) {
  return (
    <div className="task-stats" role="region" aria-label="Resumo das tarefas">
      <div className="task-stats__item">
        <span className="task-stats__value">{stats.total}</span>
        <span className="task-stats__label">Total</span>
      </div>
      <div className="task-stats__item task-stats__item--pending">
        <span className="task-stats__value">{stats.pending}</span>
        <span className="task-stats__label">Pendentes</span>
      </div>
      <div className="task-stats__item task-stats__item--done">
        <span className="task-stats__value">{stats.completed}</span>
        <span className="task-stats__label">Concluídas</span>
      </div>
    </div>
  );
}
