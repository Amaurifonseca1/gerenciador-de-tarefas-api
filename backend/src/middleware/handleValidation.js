import { validationResult } from "express-validator";
import { sendError } from "../utils/response.js";

export function handleValidation(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = {};
  for (const e of result.array()) {
    const key = e.path || e.type || "field";
    if (!errors[key]) errors[key] = [];
    errors[key].push(e.msg);
  }

  return sendError(res, "Dados inválidos. Verifique os campos.", 422, errors);
}
