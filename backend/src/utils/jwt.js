import jwt from "jsonwebtoken";
import { config } from "../config.js";

const ISSUER = "gerenciador-tarefas-api";

export function signToken(payload) {
  return jwt.sign(
    { sub: payload.userId, email: payload.email },
    config.jwtSecret,
    { expiresIn: "7d", issuer: ISSUER }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret, { issuer: ISSUER });
}
