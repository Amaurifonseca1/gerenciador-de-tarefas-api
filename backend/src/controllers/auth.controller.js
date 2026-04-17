import * as authService from "../services/auth.service.js";
import { sendCreated, sendError, sendSuccess } from "../utils/response.js";

export function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = authService.register(email, password);
    return sendCreated(res, result, "Conta criada com sucesso.");
  } catch (err) {
    if (err.statusCode === 409) {
      return sendError(res, err.message, 409);
    }
    return next(err);
  }
}

export function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = authService.login(email, password);
    return sendSuccess(res, result, { message: "Login realizado com sucesso." });
  } catch (err) {
    if (err.statusCode === 401) {
      return sendError(res, err.message, 401);
    }
    return next(err);
  }
}
