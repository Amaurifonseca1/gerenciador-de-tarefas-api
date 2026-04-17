import { api } from "../lib/api";
import type { AuthSession, AuthUser } from "../types/auth";

interface AuthPayload {
  token: string;
  user: AuthUser;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthSession> {
    const { data } = await api.post<{ success?: boolean; data: AuthPayload }>("/login", {
      email,
      password,
    });
    const payload = data.data;
    return { token: payload.token, user: payload.user };
  },

  async register(email: string, password: string): Promise<AuthSession> {
    const { data } = await api.post<{ success?: boolean; data: AuthPayload }>("/register", {
      email,
      password,
    });
    const payload = data.data;
    return { token: payload.token, user: payload.user };
  },
};
