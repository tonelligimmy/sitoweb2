import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:3000/api";

function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [ingredienti, setIngredienti] = useState("");
  const [istruzioni, setIstruzioni] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Carica dati ricetta
  useEffect(() => {
    async function loadRecipe() {
      try {
        const res = await fetch(`${API_URL}/recipes/local/${id}`);
        if (!res.ok) throw new Error("Errore nel caricamento della ricetta");
        const data = await res.json();

        setTitolo(data.titolo || "");
        setDescrizione(data.descrizione || "");
        setIngredienti((data.ingredienti || []).join(", "));
        setIstruzioni(data.istruzioni || "");
        setImageUrl(data.imageUrl || "");
      } catch (err) {
        console.error(err);
        setError("Impossibile caricare la ricetta.");
      } finally {
        setLoading(false);
      }
    }

    loadRecipe();
  }, [id]);

  // Salvataggio modifiche
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Devi essere loggato per modificare una ricetta.");
      return;
    }

    try {
      const body = {
        titolo,
        descrizione,
        ingredienti: ingredienti
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
        istruzioni,
        imageUrl,
      };

      const res = await fetch(`${API_URL}/recipes/local/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Errore durante l'aggiornamento della ricetta");
      setSuccess("Ricetta aggiornata con successo!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      console.error(err);
      setError("Impossibile aggiornare la ricetta.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5 bg-light min-vh-100">
        <Navbar />
        <h4>Caricamento ricetta...</h4>
      </div>
    );
  }

  if (error && !titolo) {
    return (
      <div className="text-center py-5 bg-light min-vh-100">
        <Navbar />
        <h4 className="text-danger">{error}</h4>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: "linear-gradient(135deg, #fff6f6 0%, #f7f7f7 100%)",
      }}
    >
      <Navbar />

      <div className="container py-5 flex-grow-1">
        <div
          className="card shadow-lg p-4 border-0 mx-auto"
          style={{
            maxWidth: "800px",
            borderRadius: "16px",
            backgroundColor: "white",
          }}
        >
          <h2 className="fw-bold mb-4 text-center" style={{ color: "#d60909" }}>
            Modifica Ricetta ✏️
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Titolo</label>
              <input
                type="text"
                className="form-control"
                value={titolo}
                onChange={(e) => setTitolo(e.target.value)}
                required
                style={{
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  backgroundColor: "#fafafa",
                }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Descrizione</label>
              <textarea
                className="form-control"
                rows="3"
                value={descrizione}
                onChange={(e) => setDescrizione(e.target.value)}
                required
                style={{
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  backgroundColor: "#fafafa",
                }}
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Ingredienti</label>
              <input
                type="text"
                className="form-control"
                value={ingredienti}
                onChange={(e) => setIngredienti(e.target.value)}
                placeholder="Separati da virgola, es: farina, uova, latte"
                required
                style={{
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  backgroundColor: "#fafafa",
                }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Istruzioni</label>
              <textarea
                className="form-control"
                rows="4"
                value={istruzioni}
                onChange={(e) => setIstruzioni(e.target.value)}
                required
                style={{
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  backgroundColor: "#fafafa",
                }}
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">URL immagine</label>
              <input
                type="url"
                className="form-control"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/foto.jpg"
                required
                style={{
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  backgroundColor: "#fafafa",
                }}
              />
            </div>

            {/* Preview immagine */}
            {imageUrl && (
              <div className="text-center mb-3">
                <img
                  src={imageUrl}
                  alt="Anteprima"
                  className="img-fluid rounded shadow-sm"
                  style={{ maxHeight: "200px", objectFit: "cover" }}
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}

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
              {loading ? "Salvataggio..." : "Salva modifiche"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditRecipePage;
