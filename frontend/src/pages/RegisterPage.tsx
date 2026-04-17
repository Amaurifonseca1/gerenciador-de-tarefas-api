import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getApiErrorMessage } from "../lib/api";
import { Alert, Button } from "../components/ui";
import "./auth.css";

export default function RegisterPage() {
  const { isAuthenticated, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await register(email.trim(), password);
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
            <span>Criando conta…</span>
          </div>
        ) : null}

        <h1>Criar conta</h1>
        <p>Cadastre-se para guardar suas tarefas de forma segura.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error ? (
            <Alert variant="error" role="alert">
              {error}
            </Alert>
          ) : null}

          <label htmlFor="register-email">
            E-mail
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
              disabled={loading}
            />
          </label>

          <label htmlFor="register-password">
            Senha
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required
              disabled={loading}
            />
          </label>

          <label htmlFor="register-confirm">
            Confirmar senha
            <input
              id="register-confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(ev) => setConfirm(ev.target.value)}
              required
              disabled={loading}
            />
          </label>

          <div className="auth-actions">
            <Button className="auth-submit-btn" type="submit" variant="primary" fullWidth disabled={loading}>
              Cadastrar
            </Button>
          </div>
        </form>

        <p className="auth-footer">
          Já tem conta? <Link to="/login">Fazer login</Link>
        </p>
      </div>
    </div>
  );
}
