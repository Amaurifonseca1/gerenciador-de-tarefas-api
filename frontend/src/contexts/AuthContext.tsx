import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { clearSession, loadSession, saveSession } from "../auth/storage";
import { setUnauthorizedHandler } from "../lib/api";
import { authService } from "../services/authService";
import type { AuthSession } from "../types/auth";

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => loadSession());
  const navigate = useNavigate();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setSession(null);
      navigate("/login", { replace: true });
    });
    return () => setUnauthorizedHandler(null);
  }, [navigate]);

  const login = useCallback(
    async (email: string, password: string) => {
      const next = await authService.login(email, password);
      saveSession(next);
      setSession(next);
      navigate("/", { replace: true, state: { loginOk: true } });
    },
    [navigate]
  );

  const register = useCallback(
    async (email: string, password: string) => {
      const next = await authService.register(email, password);
      saveSession(next);
      setSession(next);
      navigate("/", { replace: true, state: { welcome: true } });
    },
    [navigate]
  );

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session?.token),
      login,
      register,
      logout,
    }),
    [session, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }
  return ctx;
}
