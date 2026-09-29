import {
  useState,
  type FormEvent,
} from "react";

import { useAuth } from "../context/AuthContext";
import { getScore } from "../services/api";
import type { ScoreResponse } from "../types";

export function ScorePage() {
  const { token, user, logout } = useAuth();

  const [rut, setRut] = useState(
    user?.role === "user"
      ? user.rut ?? ""
      : "",
  );

  const [score, setScore] =
    useState<ScoreResponse | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!token) return;

    setError("");
    setScore(null);
    setLoading(true);

    try {
      const result = await getScore(
        rut.trim(),
        token,
      );

      setScore(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible consultar el score",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-page">
      <header className="app-header">
        <div className="brand header-brand">
          <div className="brand-mark">P</div>

          <div>
            <h1>ProntoPaga</h1>
            <span>Financial Score</span>
          </div>
        </div>

        <div className="user-menu">
          <div>
            <strong>{user?.username}</strong>
            <span>
              {user?.role === "admin"
                ? "Administrador"
                : "Usuario"}
            </span>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={logout}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="score-container">
        <section className="score-panel">
          <div className="score-heading">
            <span className="eyebrow">
              CONSULTA FINANCIERA
            </span>

            <h2>Score financiero</h2>

            <p>
              Consulta el indicador financiero asociado
              a un RUT.
            </p>
          </div>

          <form
            className="score-form"
            onSubmit={handleSubmit}
          >
            <label htmlFor="rut">RUT</label>

            <div className="rut-row">
              <input
                id="rut"
                value={rut}
                onChange={(event) =>
                  setRut(event.target.value)
                }
                placeholder="12.345.678-5"
                disabled={user?.role === "user"}
                required
              />

              <button
                className="primary-button consult-button"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Consultando..."
                  : "Consultar"}
              </button>
            </div>

            {user?.role === "user" && (
              <small>
                Por seguridad, tu perfil solamente puede
                consultar el RUT asociado a tu cuenta.
              </small>
            )}
          </form>

          {error && (
            <div className="alert error-alert">
              {error}
            </div>
          )}

          {score && (
            <section className="result-card">
              <span className="result-label">
                SCORE
              </span>

              <strong className="score-number">
                {score.score}
              </strong>

              <span className="score-range">
                de 100
              </span>

              <div className="score-details">
                <div>
                  <span>RUT consultado</span>
                  <strong>{score.rut}</strong>
                </div>

                <div>
                  <span>Fecha de consulta</span>
                  <strong>
                    {new Date(
                      score.fecha,
                    ).toLocaleString("es-CL")}
                  </strong>
                </div>
              </div>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}