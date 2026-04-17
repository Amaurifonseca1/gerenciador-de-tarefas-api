import axios, { AxiosError } from "axios";
import { clearSession, loadSession } from "../auth/storage";

const baseURL =
  typeof import.meta.env.VITE_API_URL === "string" && import.meta.env.VITE_API_URL.length > 0
    ? import.meta.env.VITE_API_URL
    : "http://127.0.0.1:3001/api";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

api.interceptors.request.use((config) => {
  const session = loadSession();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = (error as AxiosError).response?.status;
    const url = String((error as AxiosError).config?.url ?? "");
    const isAuthRoute = url.includes("/login") || url.includes("/register");
    if (status === 401 && !isAuthRoute) {
      clearSession();
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

export interface ApiErrorData {
  message?: string;
  errors?: Record<string, string[]>;
  success?: boolean;
}

export function getApiErrorMessage(err: unknown): string {
  if (!err || typeof err !== "object") return "Ocorreu um erro inesperado.";

  const axiosError = err as AxiosError<ApiErrorData>;
  const data = axiosError.response?.data;

  if (data?.message && typeof data.message === "string") return data.message;
  if (data?.errors && typeof data.errors === "object") {
    const first = Object.values(data.errors).flat()[0];
    if (typeof first === "string") return first;
  }

  const status = axiosError.response?.status;
  if (status === 404) return "Recurso não encontrado.";
  if (status === 422) return "Dados inválidos. Verifique os campos.";
  if (status && status >= 500) return "Erro no servidor. Tente novamente mais tarde.";

  return axiosError.message || "Ocorreu um erro inesperado.";
}
