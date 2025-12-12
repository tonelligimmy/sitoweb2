import React, { useState } from "react";
import api from "../services/api";
import auth from "../services/auth";
import "bootstrap/dist/css/bootstrap.min.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Tentativo di login:", { username, password });

    setError("");
    setLoading(true);

    try {
      const data = await api.post("/auth/login", { username, password });
      auth.saveToken(data.token);
      auth.saveUser(data.user);
      console.log("Login riuscito, token salvato:", data.token);
      window.location.href = "/home";
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
          width: "380px",
          borderRadius: "16px",
          backgroundColor: "white",
        }}
      >
        <h2
          className="text-center mb-3 fw-bold"
          style={{ color: "#d60909", letterSpacing: "0.5px" }}
        >
          Benvenuto 👋
        </h2>
        <p className="text-center text-muted mb-4">
          Accedi per scoprire nuove ricette!
        </p>

        <form onSubmit={handleSubmit}>
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
                padding: "10px",
                backgroundColor: "#fafafa",
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
                padding: "10px",
                backgroundColor: "#fafafa",
              }}
              disabled={loading}
            />
          </div>

          {error && (
            <div
              className="alert alert-danger py-2 text-center"
              style={{
                borderRadius: "8px",
                fontSize: "0.9rem",
              }}
            >
              {error}
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
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#b20707")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#d60909")}
            disabled={loading}
          >
            {loading ? "Accesso..." : "Accedi"}
          </button>
        </form>

        <p className="text-center mt-3 text-muted">
          Non hai un account?{" "}
          <a
            href="/register"
            style={{
              color: "#d60909",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Registrati
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
