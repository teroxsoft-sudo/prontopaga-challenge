import { useState, type FormEvent } from "react";
import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { login } from "../services/api";

export function LoginPage() {
  const navigate = useNavigate();
  const { setSession, isAuthenticated } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/score" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await login(
        username.trim(),
        password,
      );

      setSession(response.token, response.user);
      navigate("/score");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible iniciar sesión",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand">
          <div className="brand-mark">P</div>

          <div>
            <h1>ProntoPaga</h1>
            <span>Financial Score</span>
          </div>
        </div>

        <div className="login-heading">
          <h2>Bienvenido</h2>
          <p>
            Ingresa tus credenciales para consultar el
            score financiero.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Usuario</label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            placeholder="Ingresa tu usuario"
            autoComplete="username"
            required
          />

          <label htmlFor="password">Contraseña</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            required
          />

          {error && (
            <div className="alert error-alert">
              {error}
            </div>
          )}

          <button
            className="primary-button"
            disabled={loading}
            type="submit"
          >
            {loading
              ? "Ingresando..."
              : "Iniciar sesión"}
          </button>
        </form>

        <div className="demo-users">
          <strong>Credenciales de prueba</strong>
          <span>
            Usuario: <code>user / User123!</code>
          </span>
          <span>
            Admin: <code>admin / Admin123!</code>
          </span>
        </div>
      </section>
    </main>
  );
}