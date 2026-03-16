import type { Task } from "../../types/task";
import { Badge, Button } from "../ui";

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDeleteClick: (task: Task) => void;
}

export function TaskTable({ tasks, onEdit, onDeleteClick }: TaskTableProps) {
  return (
    <div className="task-table-wrap" role="region" aria-label="Lista de tarefas">
      <table className="task-table">
        <thead>
          <tr>
            <th scope="col">Título</th>
            <th scope="col">Descrição</th>
            <th scope="col">Status</th>
            <th scope="col">
              <span className="visually-hidden">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td className="task-table__description">
                {task.description || "—"}
              </td>
              <td>
                <Badge status={task.status as "pendente" | "em andamento" | "concluído"} />
              </td>
              <td>
                <div className="task-table__actions">
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
