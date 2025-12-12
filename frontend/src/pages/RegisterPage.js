import React, { useState } from "react";
import api from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [dataNascita, setDataNascita] = useState("");
  const [piattiPreferiti, setPiattiPreferiti] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirm) {
      setError("Le password non coincidono.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        username,
        email,
        nome,
        cognome,
        dataNascita,
        piattiPreferiti,
        password,
      });
      setSuccess("Registrazione avvenuta con successo! Ora puoi accedere.");
      setUsername("");
      setEmail("");
      setNome("");
      setCognome("");
      setDataNascita("");
      setPiattiPreferiti("");
      setPassword("");
      setConfirm("");
    } catch (error) {
      setError(error.message || "Errore di connessione al server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex vh-100 align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #fff6f6 0%, #f7f7f7 100%)",
      }}
    >
      <div
        className="card shadow-lg p-4 border-0"
        style={{
          width: "720px",
          borderRadius: "16px",
          backgroundColor: "white",
        }}
      >
        <h2
          className="text-center mb-2 fw-bold"
          style={{ color: "#d60909", letterSpacing: "0.5px" }}
        >
          Crea il tuo account 🍳
        </h2>
        <p className="text-center text-muted mb-4">
          Unisciti alla community di amanti della cucina!
        </p>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="row">
            {/* COLONNA SINISTRA */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-semibold">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    backgroundColor: "#fafafa",
                    padding: "10px",
                  }}
                  disabled={loading}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    backgroundColor: "#fafafa",
                    padding: "10px",
                  }}
                  disabled={loading}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  style={{
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    backgroundColor: "#fafafa",
                    padding: "10px",
                  }}
                  disabled={loading}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Cognome</label>
                <input
                  type="text"
                  className="form-control"
                  value={cognome}
                  onChange={(e) => setCognome(e.target.value)}
                  required
                  style={{
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    backgroundColor: "#fafafa",
                    padding: "10px",
                  }}
                  disabled={loading}
                />
              </div>
            </div>

            {/* COLONNA DESTRA */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Data di nascita
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={dataNascita}
                  onChange={(e) => setDataNascita(e.target.value)}
                  required
                  style={{
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    backgroundColor: "#fafafa",
                    padding: "10px",
                  }}
                  disabled={loading}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Piatti preferiti
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={piattiPreferiti}
                  onChange={(e) => setPiattiPreferiti(e.target.value)}
                  placeholder="Es: pizza, pasta, risotto"
                  required
                  style={{
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    backgroundColor: "#fafafa",
                    padding: "10px",
                  }}
                  disabled={loading}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    backgroundColor: "#fafafa",
                    padding: "10px",
                  }}
                  disabled={loading}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Conferma Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  style={{
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    backgroundColor: "#fafafa",
                    padding: "10px",
                  }}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {error && (
            <div
              className="alert alert-danger py-2 text-center"
              style={{ borderRadius: "8px" }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              className="alert alert-success py-2 text-center"
              style={{ borderRadius: "8px" }}
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            className="btn w-100 fw-bold py-2 mt-2"
            style={{
              backgroundColor: "#d60909",
              color: "white",
              borderRadius: "10px",
              boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#b20707")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#d60909")}
            disabled={loading}
          >
            {loading ? "Registrazione..." : "Registrati"}
          </button>
        </form>

        <p className="text-center mt-3 text-muted">
          Hai già un account?{" "}
          <a
            href="/login"
            style={{
              color: "#d60909",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Accedi
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
