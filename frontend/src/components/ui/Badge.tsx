import type { TaskStatus } from "../../types/task";

interface BadgeProps {
  status: TaskStatus;
  children?: React.ReactNode;
}

const variantClass: Record<TaskStatus, string> = {
  pendente: "badge--pending",
  "em andamento": "badge--progress",
  concluído: "badge--done",
};

export function Badge({ status, children }: BadgeProps) {
  return (
    <span className={`badge ${variantClass[status]}`}>
      {children ?? status}
    </span>
  );
}
