import type { AuthSession } from "../types/auth";

const STORAGE_KEY = "gerenciador_tarefas_auth";

export function loadSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.token || typeof parsed.token !== "string") return null;
    if (!parsed.user?.email || typeof parsed.user.id !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}
