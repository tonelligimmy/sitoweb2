import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import auth from "../services/auth";

const API_URL = "http://localhost:3000/api";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [passwordChange, setPasswordChange] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  // carica dati utente e ricettario
  useEffect(() => {
    const token = auth.getToken();
    if (!token) return navigate("/login");

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Errore caricamento utente");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Errore:", error);
      }
    };

    const fetchRecipes = async () => {
      try {
        const res = await fetch(`${API_URL}/recipes/recipeBook`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Errore caricamento ricettario");
        const data = await res.json();
        setRecipes(data);
      } catch (error) {
        console.error("Errore caricamento ricettario:", error);
      }
    };

    fetchUser();
    fetchRecipes();
  }, [navigate]);

  if (!user) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-danger" role="status"></div>
      </div>
    );
  }

  // aggiornamento profilo
  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getToken()}`,
        },
        body: JSON.stringify({
          nome: user.nome,
          cognome: user.cognome,
          email: user.email,
          piattiPreferiti: user.piattiPreferiti,
        }),
      });
      if (!res.ok) throw new Error("Errore aggiornamento");
      const data = await res.json();
      setUser(data);
      setEditing(false);
    } catch (error) {
      console.error("Errore salvataggio:", error);
    }
  };

  // cambio password
  const handleChangePassword = async () => {
    if (!passwordChange.new || passwordChange.new !== passwordChange.confirm) {
      alert("Le nuove password non coincidono!");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getToken()}`,
        },
        body: JSON.stringify(passwordChange),
      });
      if (!res.ok) throw new Error("Errore cambio password");
      alert("Password cambiata con successo!");
      setPasswordChange({ current: "", new: "", confirm: "" });
    } catch (error) {
      console.error("Errore cambio password:", error);
    }
  };

  // Eliminazione profilo
  const handleDeleteProfile = async () => {
    const conferma = window.confirm(
      "⚠️ Sei sicuro di voler eliminare definitivamente il tuo profilo? L'operazione è irreversibile!"
    );
    if (!conferma) return;

    try {
      const res = await fetch(`${API_URL}/users/me`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      });
      if (!res.ok) throw new Error("Errore eliminazione profilo");
      auth.logout();
      alert("Profilo eliminato con successo!");
      navigate("/register");
    } catch (error) {
      console.error("Errore durante l'eliminazione profilo:", error);
      alert("Errore durante l'eliminazione del profilo");
    }
  };

  return (
    <div style={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Navbar />
      <div className="container py-5">
        <h2 className="fw-bold mb-4" style={{ color: "#d60909" }}>
          Il mio profilo
        </h2>

        {/* Sezione dati u*/}
        <div className="card shadow-sm border-0 mb-5">
          <div className="card-body">
            {!editing ? (
              <>
                <p>
                  <strong>Nome:</strong> {user.nome}
                </p>
                <p>
                  <strong>Cognome:</strong> {user.cognome}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Piatti preferiti:</strong>{" "}
                  {user.piattiPreferiti?.join(", ") || "Nessuno"}
                </p>
                <div className="d-flex gap-2">
                    <button
                        onClick={() => setEditing(true)}
                        className="btn btn-outline-danger"
                        >
                        Modifica profilo
                        </button>
                        <button
                            className="btn btn-outline-danger fw-bold"
                            onClick={handleDeleteProfile}
                        >
                            🗑️ Elimina profilo
                        </button>    
                </div>
              </>
            ) : (
              <>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nome</label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      value={user.nome}
                      onChange={(e) =>
                        setUser({ ...user, nome: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Cognome</label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      value={user.cognome}
                      onChange={(e) =>
                        setUser({ ...user, cognome: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    required
                    type="email"
                    className="form-control"
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Piatti preferiti</label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    placeholder="Inserisci piatti separati da virgola"
                    value={user.piattiPreferiti?.join(", ") || ""}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        piattiPreferiti: e.target.value
                          .split(",")
                          .map((x) => x.trim()),
                      })
                    }
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="btn"
                  style={{ backgroundColor: "#d60909", color: "white" }}
                >
                  Salva modifiche
                </button>
              </>
            )}
          </div>
        </div>

        {/* CAMBIO PASSWORD */}
        <div className="card shadow-sm border-0 mb-5">
          <div className="card-body">
            <h5 className="fw-bold mb-3" style={{ color: "#d60909" }}>
              Cambia password
            </h5>
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password attuale"
              value={passwordChange.current}
              onChange={(e) =>
                setPasswordChange({ ...passwordChange, current: e.target.value })
              }
            />
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Nuova password"
              value={passwordChange.new}
              onChange={(e) =>
                setPasswordChange({ ...passwordChange, new: e.target.value })
              }
            />
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Conferma nuova password"
              value={passwordChange.confirm}
              onChange={(e) =>
                setPasswordChange({
                  ...passwordChange,
                  confirm: e.target.value,
                })
              }
            />
            <button
              className="btn"
              onClick={handleChangePassword}
              style={{ backgroundColor: "#d60909", color: "white" }}
            >
              Aggiorna password
            </button>
          </div>
        </div>

        {/* RICETTARIO */}
        <div className="card shadow-sm border-0">
        <div className="card-body">
            <h5 className="fw-bold mb-3" style={{ color: "#d60909" }}>
            Il mio ricettario
            </h5>

            <button
            className="btn mb-4"
            style={{ backgroundColor: "#d60909", color: "white" }}
            onClick={() => navigate("/add-recipe")}
            >
            ➕ Aggiungi ricetta
            </button>

            {recipes.length === 0 ? (
            <p className="text-secondary">Nessuna ricetta salvata.</p>
            ) : (
            <div className="row">
                {recipes.map((r) => (
                <div key={r._id} className="col-md-4 mb-4">
                    <div className="card h-100 shadow-sm" style={{ cursor: "pointer" }}>
                    <img
                        src={r.imageUrl || "/placeholder.png"}
                        alt={r.titolo}
                        className="card-img-top"
                        style={{
                        height: "180px",
                        objectFit: "cover",
                        borderRadius: "4px 4px 0 0",
                        }}
                    />
                    <div className="card-body">
                        <h6 className="card-title fw-bold">{r.titolo}</h6>
                        <p className="text-muted small">
                        {r.descrizione?.slice(0, 60)}...
                        </p>
                        <div className="d-flex flex-wrap gap-2">
                        <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => navigate(`/edit-recipe/${r._id}`)}
                        >
                            ✏️ Modifica
                        </button>
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => navigate(`/recipe/${r._id}?source=local`)}
                        >
                            👁️ Visualizza
                        </button>
                        <button
                            className="btn btn-outline-dark btn-sm"
                            onClick={async () => {
                            const conferma = window.confirm(
                                `Vuoi davvero eliminare la ricetta "${r.titolo}"?`
                            );
                            if (!conferma) return;

                            try {
                                const res = await fetch(`${API_URL}/recipes/local/${r._id}`, {
                                method: "DELETE",
                                headers: {
                                    Authorization: `Bearer ${auth.getToken()}`,
                                },
                                });
                                if (!res.ok) throw new Error("Errore eliminazione");
                                setRecipes(recipes.filter((x) => x._id !== r._id));
                            } catch (error) {
                                console.error("Errore durante l'eliminazione:", error);
                                alert("Errore durante l'eliminazione della ricetta");
                            }
                            }}
                        >
                            🗑️ Elimina
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
        </div>

      </div>
    </div>
  );
}

export default ProfilePage;
