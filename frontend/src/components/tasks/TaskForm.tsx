import { Card, Input, Textarea, Select, Button, Alert } from "../ui";
import { STATUS_OPTIONS, type TaskStatus } from "../../types/task";

interface TaskFormProps {
  title: string;
  description: string;
  status: TaskStatus;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onStatusChange: (v: TaskStatus) => void;
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
  onTitleChange,
  onDescriptionChange,
  onStatusChange,
  onSubmit,
  onCancelEdit,
  editingId,
  submitting,
  successMessage,
  errorMessage,
}: TaskFormProps) {
  return (
    <Card as="section" className="task-form-card" aria-labelledby="form-heading">
      <h2 id="form-heading" className="visually-hidden">
        {editingId ? "Editar tarefa" : "Nova tarefa"}
      </h2>
      <form onSubmit={onSubmit} noValidate>
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
        <Textarea
          id="task-description"
          label="Descrição"
          placeholder="Detalhes da tarefa (opcional)"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          disabled={submitting}
          rows={4}
        />
        <Select
          id="task-status"
          label="Status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
          disabled={submitting}
        />
        <div className="task-form__actions">
          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
            isLoading={submitting}
          >
            {editingId ? "Atualizar tarefa" : "Criar tarefa"}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancelEdit}
              disabled={submitting}
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
      {successMessage && (
        <Alert variant="success">{successMessage}</Alert>
      )}
      {errorMessage && (
        <Alert variant="error">{errorMessage}</Alert>
      )}
    </Card>
  );
}
