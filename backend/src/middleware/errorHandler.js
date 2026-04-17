import { sendError } from "../utils/response.js";

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  // eslint-disable-next-line no-console
  console.error(err);

  const status = err.statusCode || err.status || 500;
  const message =
    status >= 500 ? "Erro interno no servidor. Tente novamente mais tarde." : err.message || "Erro na requisição.";

  return sendError(res, message, status);
}
