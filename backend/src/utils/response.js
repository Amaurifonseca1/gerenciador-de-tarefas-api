/**
 * Envelope padrão da API:
 * { success: boolean, data?: any, message?: string, errors?: any }
 */
export function sendResponse(res, statusCode, { success, data, message, errors }) {
  const body = { success };
  if (data !== undefined) body.data = data;
  if (message !== undefined) body.message = message;
  if (errors !== undefined) body.errors = errors;
  return res.status(statusCode).json(body);
}

/** Resposta de sucesso com corpo em `data` (e mensagem opcional). */
export function sendSuccess(res, data, { message, status = 200 } = {}) {
  return sendResponse(res, status, {
    success: true,
    data,
    ...(message !== undefined ? { message } : {}),
  });
}

export function sendCreated(res, data, message = "Recurso criado com sucesso.") {
  return sendResponse(res, 201, { success: true, data, message });
}

/** Sucesso sem payload (ex.: exclusão). */
export function sendSuccessMessage(res, message, status = 200) {
  return sendResponse(res, status, { success: true, message });
}

/** Erro padronizado (4xx / 5xx). */
export function sendError(res, message, status = 400, errors = undefined) {
  return sendResponse(res, status, {
    success: false,
    message,
    ...(errors !== undefined ? { errors } : {}),
  });
}
