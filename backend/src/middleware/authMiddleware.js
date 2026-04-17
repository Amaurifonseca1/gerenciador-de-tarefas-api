import { verifyToken } from "../utils/jwt.js";
import { sendError } from "../utils/response.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return sendError(res, "Autenticação necessária.", 401);
  }

  const token = header.slice(7).trim();
  if (!token) {
    return sendError(res, "Autenticação necessária.", 401);
  }

  try {
    const decoded = verifyToken(token);
    req.user = { id: Number(decoded.sub), email: decoded.email };
    return next();
  } catch {
    return sendError(res, "Token inválido ou expirado.", 401);
  }
}
