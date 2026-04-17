import { Card, Input, Textarea, Select, Button, Alert } from "../ui";
import { PRIORITY_OPTIONS, STATUS_OPTIONS, type TaskPriority, type TaskStatus } from "../../types/task";

interface TaskFormProps {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  due_date: string;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onStatusChange: (v: TaskStatus) => void;
  onPriorityChange: (v: TaskPriority) => void;
  onCategoryChange: (v: string) => void;
  onDueDateChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancelEdit: () => void;
  editingId: number | null;
  submitting: boolean;
  successMessage: string;
  errorMessage: string;
}

export function TaskForm({
  title,
  description,
  status,
  priority,
  category,
  due_date,
  onTitleChange,
  onDescriptionChange,
  onStatusChange,
  onPriorityChange,
  onCategoryChange,
  onDueDateChange,
  onSubmit,
  onCancelEdit,
  editingId,
  submitting,
  successMessage,
  errorMessage,
}: TaskFormProps) {
  return (
    <Card as="section" className="task-form-card" aria-labelledby="form-heading">
      <h2 id="form-heading" className="task-form-card__heading">
        {editingId ? "Editar tarefa" : "Nova tarefa"}
      </h2>
      <form onSubmit={onSubmit} noValidate>
        <div className="task-form-grid">
          <Input
            id="task-title"
            label="Título"
            placeholder="Ex.: Revisar relatório"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            disabled={submitting}
            required
            autoComplete="off"
          />
          <Input
            id="task-category"
            label="Categoria"
            placeholder="Ex.: Estudos, Trabalho"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={submitting}
            maxLength={80}
            autoComplete="off"
          />
          <Select
            id="task-priority"
            label="Prioridade"
            options={PRIORITY_OPTIONS}
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value as TaskPriority)}
            disabled={submitting}
          />
          <Input
            id="task-due"
            label="Data limite"
            type="date"
            value={due_date}
            onChange={(e) => onDueDateChange(e.target.value)}
            disabled={submitting}
          />
          <Select
            id="task-status"
            label="Status"
            options={STATUS_OPTIONS}
            value={status}
            onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
            disabled={submitting}
          />
        </div>
        <Textarea
          id="task-description"
          label="Descrição"
          placeholder="Detalhes da tarefa (opcional)"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          disabled={submitting}
          rows={4}
        />
        <div className="task-form__actions">
          <Button type="submit" variant="primary" disabled={submitting} isLoading={submitting}>
            {editingId ? "Atualizar tarefa" : "Criar tarefa"}
          </Button>
          {editingId ? (
            <Button type="button" variant="secondary" onClick={onCancelEdit} disabled={submitting}>
              Cancelar
            </Button>
          ) : null}
        </div>
      </form>
      {successMessage ? <Alert variant="success">{successMessage}</Alert> : null}
      {errorMessage ? <Alert variant="error">{errorMessage}</Alert> : null}
    </Card>
  );
}
