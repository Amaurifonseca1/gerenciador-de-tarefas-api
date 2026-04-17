import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getApiErrorMessage } from "../lib/api";
import { Alert, Button } from "../components/ui";
import "./auth.css";

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className={`auth-card${loading ? " auth-card--busy" : ""}`}>
        {loading ? (
          <div className="auth-card__overlay" aria-live="polite">
            <span className="auth-card__spinner" aria-hidden />
            <span>Entrando…</span>
          </div>
        ) : null}

        <h1>Entrar</h1>
        <p>Acesse o gerenciador de tarefas com sua conta.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error ? (
            <Alert variant="error" role="alert">
              {error}
            </Alert>
          ) : null}

          <label htmlFor="login-email">
            E-mail
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
              disabled={loading}
            />
          </label>

          <label htmlFor="login-password">
            Senha
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required
              disabled={loading}
            />
          </label>

          <div className="auth-actions">
            <Button className="auth-submit-btn" type="submit" variant="primary" fullWidth disabled={loading}>
              Entrar
            </Button>
          </div>
        </form>

        <p className="auth-footer">
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
