import { body, query, param } from "express-validator";
import { TASK_PRIORITIES, TASK_STATUSES } from "../db/database.js";

export const listTaskValidators = [
  query("status").optional().isIn(TASK_STATUSES).withMessage("O status selecionado é inválido."),
  query("priority").optional().isIn(TASK_PRIORITIES).withMessage("A prioridade selecionada é inválida."),
  query("overdue")
    .optional()
    .isIn(["1", "true", "0", "false"])
    .withMessage("O filtro de atrasadas deve ser 1, true, 0 ou false."),
  query("q").optional().isString().isLength({ max: 100 }).withMessage("A busca não pode ter mais de 100 caracteres."),
  query("sort_by")
    .optional()
    .isIn(["created_at", "updated_at", "title", "status", "priority", "due_date", "category"])
    .withMessage("Campo de ordenação inválido."),
  query("sort_order").optional().isIn(["asc", "desc"]).withMessage("Ordem de classificação inválida."),
  query("per_page").optional().isInt({ min: 5, max: 50 }).withMessage("Itens por página deve ser entre 5 e 50."),
  query("page").optional().isInt({ min: 1 }).withMessage("Página inválida."),
];

export const storeTaskValidators = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("O título é obrigatório.")
    .isLength({ max: 255 })
    .withMessage("O título não pode ter mais de 255 caracteres."),
  body("description")
    .optional({ values: "falsy" })
    .isString()
    .isLength({ max: 2000 })
    .withMessage("A descrição não pode ter mais de 2000 caracteres."),
  body("status")
    .notEmpty()
    .withMessage("O status é obrigatório.")
    .isIn(TASK_STATUSES)
    .withMessage("O status selecionado é inválido."),
  body("priority")
    .optional({ values: "falsy" })
    .isIn(TASK_PRIORITIES)
    .withMessage("A prioridade selecionada é inválida."),
  body("category")
    .optional({ values: "falsy" })
    .isString()
    .isLength({ max: 80 })
    .withMessage("A categoria não pode ter mais de 80 caracteres."),
  body("due_date")
    .optional({ nullable: true })
    .custom((v) => v === null || v === undefined || v === "" || /^\d{4}-\d{2}-\d{2}$/.test(String(v)))
    .withMessage("A data limite deve estar no formato AAAA-MM-DD."),
];

export const updateTaskValidators = [
  param("id").isInt({ min: 1 }).withMessage("Identificador da tarefa inválido."),
  ...storeTaskValidators,
];

export const idParamValidator = [param("id").isInt({ min: 1 }).withMessage("Identificador da tarefa inválido.")];
