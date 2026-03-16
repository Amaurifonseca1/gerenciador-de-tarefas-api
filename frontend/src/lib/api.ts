import axios, { AxiosError } from "axios";

const baseURL =
  typeof import.meta.env.VITE_API_URL === "string" &&
  import.meta.env.VITE_API_URL.length > 0
    ? import.meta.env.VITE_API_URL
    : "http://127.0.0.1:8000/api";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

export interface ApiErrorData {
  message?: string;
  errors?: Record<string, string[]>;
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
