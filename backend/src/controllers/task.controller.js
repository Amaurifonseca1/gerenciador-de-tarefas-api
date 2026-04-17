import * as taskService from "../services/task.service.js";
import { sendCreated, sendError, sendSuccess, sendSuccessMessage } from "../utils/response.js";

export function index(req, res, next) {
  try {
    const sortBy = req.query.sort_by || "updated_at";
    const sortOrder = req.query.sort_order || "desc";
    const page = req.query.page != null ? Number(req.query.page) : 1;
    const perPage = req.query.per_page != null ? Number(req.query.per_page) : 15;

    const result = taskService.listTasks(req.user.id, {
      status: req.query.status || undefined,
      priority: req.query.priority || undefined,
      overdue: req.query.overdue || undefined,
      q: req.query.q || undefined,
      sortBy,
      sortOrder,
      page: Number.isFinite(page) ? page : 1,
      perPage: Number.isFinite(perPage) ? perPage : 15,
    });

    return sendSuccess(res, {
      items: result.data,
      meta: result.meta,
    });
  } catch (err) {
    return next(err);
  }
}

export function show(req, res, next) {
  try {
    const id = Number(req.params.id);
    const task = taskService.getTaskById(req.user.id, id);
    if (!task) {
      return sendError(res, "Tarefa não encontrada.", 404);
    }
    return sendSuccess(res, task);
  } catch (err) {
    return next(err);
  }
}

export function store(req, res, next) {
  try {
    const { title, description, status, priority, category, due_date } = req.body;
    const task = taskService.createTask(req.user.id, {
      title,
      description,
      status,
      priority,
      category,
      due_date,
    });
    return sendCreated(res, task, "Tarefa criada com sucesso.");
  } catch (err) {
    if (err.statusCode === 422) {
      return sendError(res, err.message, 422);
    }
    return next(err);
  }
}

export function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { title, description, status, priority, category, due_date } = req.body;
    const task = taskService.updateTask(req.user.id, id, {
      title,
      description,
      status,
      priority,
      category,
      due_date,
    });
    return sendSuccess(res, task, { message: "Tarefa atualizada com sucesso." });
  } catch (err) {
    if (err.statusCode === 404) {
      return sendError(res, err.message, 404);
    }
    if (err.statusCode === 422) {
      return sendError(res, err.message, 422);
    }
    return next(err);
  }
}

export function destroy(req, res, next) {
  try {
    const id = Number(req.params.id);
    taskService.deleteTask(req.user.id, id);
    return sendSuccessMessage(res, "Tarefa excluída com sucesso.", 200);
  } catch (err) {
    if (err.statusCode === 404) {
      return sendError(res, err.message, 404);
    }
    return next(err);
  }
}
