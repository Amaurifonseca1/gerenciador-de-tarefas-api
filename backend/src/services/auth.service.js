import { signToken } from "../utils/jwt.js";
import * as userService from "./user.service.js";

export function register(email, password) {
  const existing = userService.findUserByEmail(email);
  if (existing) {
    const err = new Error("Este e-mail já está cadastrado.");
    err.statusCode = 409;
    throw err;
  }

  const user = userService.createUser(email, password);
  const token = signToken({ userId: user.id, email: user.email });

  return {
    token,
    user: { id: user.id, email: user.email },
  };
}

export function login(email, password) {
  const row = userService.findUserByEmail(email);
  if (!row || !userService.verifyPassword(password, row.password)) {
    const err = new Error("E-mail ou senha incorretos.");
    err.statusCode = 401;
    throw err;
  }

  const token = signToken({ userId: row.id, email: row.email });
  return {
    token,
    user: { id: row.id, email: row.email },
  };
}
