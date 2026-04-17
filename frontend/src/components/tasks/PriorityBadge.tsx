import type { TaskPriority } from "../../types/task";

const variantClass: Record<TaskPriority, string> = {
  baixa: "priority-badge--low",
  media: "priority-badge--mid",
  alta: "priority-badge--high",
};

const labels: Record<TaskPriority, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={`priority-badge ${variantClass[priority]}`} title={`Prioridade: ${labels[priority]}`}>
      {labels[priority]}
    </span>
  );
}
