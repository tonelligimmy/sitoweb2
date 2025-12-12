import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:3000/api";

function RicettaDettaglio() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const fonte = searchParams.get("source");

  const [ricetta, setRicetta] = useState(null);
  const [recensioni, setRecensioni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState(null);

  
  const [gusto, setGusto] = useState(3);
  const [difficolta, setDifficolta] = useState(3);
  const [note, setNote] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let ricettaData;

        if (fonte === "local") {
          const res = await fetch(`${API_URL}/recipes/local/${id}`);
          if (!res.ok) throw new Error("Errore caricamento ricetta locale");
          ricettaData = await res.json();
        } else {
          const res = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
          );
          const data = await res.json();
          ricettaData = data.meals ? data.meals[0] : null;
        }

        setRicetta(ricettaData);

        const resReviews = await fetch(`${API_URL}/reviews/${id}?fonte=${fonte}`);
        const reviewsData = await resReviews.json();

        setRecensioni(Array.isArray(reviewsData) ? reviewsData : []);
      } catch (err) {
        console.error("Errore caricamento ricetta:", err);
        setErrore("Errore durante il caricamento della ricetta o recensioni.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, fonte]);

  const handleReviewSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Devi essere loggato per lasciare una recensione.");
      return;
    }

    try {
      const body = {
        gusto,
        difficolta,
        note,
        fonte,
      };

      if (fonte === "local") body.ricettaID = id;
      else body.externalId = id;

      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Errore durante l'invio della recensione");
      const newReview = await res.json();
      setRecensioni((prev) => [...prev, newReview]);
      setNote("");
    } catch (error) {
      console.error("Errore invio recensione:", error);
      alert("Errore durante l'invio della recensione.");
    }
  };

  if (loading) {
    return (
      <div className="bg-light min-vh-100 text-center pt-5">
        <Navbar />
        <h4>Caricamento in corso...</h4>
      </div>
    );
  }

  if (errore || !ricetta) {
    return (
      <div className="bg-light min-vh-100 text-center pt-5">
        <Navbar />
        <h4 className="text-danger">{errore || "Ricetta non trovata"}</h4>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 text-dark">
      <Navbar />

      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-3" style={{ color: "#d60909" }}>
            {ricetta.titolo || ricetta.strMeal}
          </h2>
          <img
            src={ricetta.imageUrl || ricetta.strMealThumb}
            alt={ricetta.titolo || ricetta.strMeal}
            className="img-fluid rounded shadow"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        </div>

        <div className="mb-4">
          <h5 className="fw-bold">Descrizione</h5>
          <p>{ricetta.descrizione || "Nessuna descrizione disponibile."}</p>
        </div>

        <div className="mb-4">
          <h5 className="fw-bold">Ingredienti</h5>
          <ul>
            {(ricetta.ingredienti ||
              Array.from({ length: 20 })
                .map((_, i) => ricetta[`strIngredient${i + 1}`])
                .filter((ing) => ing)).map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </div>

        {/* 🔹 AGGIUNTO BLOCCO ISTRUZIONI */}
        <div className="mb-4">
          <h5 className="fw-bold">Istruzioni</h5>
          <p>{ricetta.istruzioni || ricetta.strInstructions}</p>
        </div>

        <hr />

        {/* recensioni */}
        <div className="mt-5">
          <h4 className="fw-bold mb-4" style={{ color: "#d60909" }}>
            Recensioni
          </h4>

          {recensioni.length === 0 ? (
            <p className="text-muted">Nessuna recensione presente.</p>
          ) : (
            recensioni.map((r, i) => (
              <div
                key={i}
                className="border rounded p-3 mb-3 shadow-sm bg-white"
                style={{ borderLeft: "4px solid #d60909" }}
              >
                <p className="fw-semibold mb-1" style={{ color: "#d60909" }}>
                  👤 {r.utenteID?.username || "Utente sconosciuto"}
                </p>
                <p className="mb-1">
                  <strong>Gusto:</strong> {r.gusto}/5
                </p>
                <p className="mb-1">
                  <strong>Difficoltà:</strong> {r.difficolta}/5
                </p>
                {r.note && (
                  <p className="mb-0">
                    <strong>Note:</strong> {r.note}
                  </p>
                )}
              </div>
            ))
          )}

          {/* Aggiungi recensione */}
          <div className="mt-4 p-4 border rounded bg-white shadow-sm">
            <h5 className="fw-bold mb-3">Lascia una recensione</h5>

            <div className="mb-3">
              <label className="form-label">Gusto</label>
              <input
                type="number"
                min="1"
                max="5"
                value={gusto}
                onChange={(e) => setGusto(Number(e.target.value))}
                className="form-control w-25"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Difficoltà</label>
              <input
                type="number"
                min="1"
                max="5"
                value={difficolta}
                onChange={(e) => setDifficolta(Number(e.target.value))}
                className="form-control w-25"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="form-control"
                rows="3"
              ></textarea>
            </div>

            <button
              onClick={handleReviewSubmit}
              className="btn fw-bold"
              style={{ backgroundColor: "#d60909", color: "white" }}
            >
              Invia recensione
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RicettaDettaglio;
