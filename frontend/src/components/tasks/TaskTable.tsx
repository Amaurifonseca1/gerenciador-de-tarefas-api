import type { Task } from "../../types/task";
import { Badge, Button } from "../ui";
import { formatDueDate } from "../../lib/formatTask";
import { PriorityBadge } from "./PriorityBadge";

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDeleteClick: (task: Task) => void;
  onMarkDone?: (task: Task) => void;
  completingId?: number | null;
}

export function TaskTable({ tasks, onEdit, onDeleteClick, onMarkDone, completingId }: TaskTableProps) {
  return (
    <div className="task-table-wrap" role="region" aria-label="Lista de tarefas">
      <table className="task-table">
        <thead>
          <tr>
            <th scope="col">Título</th>
            <th scope="col" className="task-table__col--hide-sm">
              Descrição
            </th>
            <th scope="col" className="task-table__col--hide-xs">
              Categoria
            </th>
            <th scope="col">Prazo</th>
            <th scope="col">Prioridade</th>
            <th scope="col">Situação</th>
            <th scope="col">
              <span className="visually-hidden">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="task-table__title-cell">{task.title}</td>
              <td className="task-table__description task-table__col--hide-sm">
                {task.description || "—"}
              </td>
              <td className="task-table__col--hide-xs">{task.category?.trim() || "—"}</td>
              <td className="task-table__due">{formatDueDate(task.due_date)}</td>
              <td>
                <PriorityBadge priority={task.priority ?? "media"} />
              </td>
              <td>
                <div className="task-table__badges">
                  {task.atrasada ? (
                    <span className="badge badge--overdue" title="Prazo anterior a hoje e tarefa não concluída">
                      Atrasada
                    </span>
                  ) : null}
                  <Badge status={task.status as "pendente" | "em andamento" | "concluído"} />
                </div>
              </td>
              <td>
                <div className="task-table__actions">
                  {onMarkDone && task.status !== "concluído" ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onMarkDone(task)}
                      isLoading={completingId === task.id}
                      aria-label={`Marcar tarefa ${task.title} como concluída`}
                    >
                      Concluir
                    </Button>
                  ) : null}
                  <Button
                    variant="edit"
                    size="sm"
                    onClick={() => onEdit(task)}
                    aria-label={`Editar tarefa ${task.title}`}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDeleteClick(task)}
                    aria-label={`Excluir tarefa ${task.title}`}
                  >
                    Excluir
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
