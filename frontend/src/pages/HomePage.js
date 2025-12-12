import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api";


function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();
  
  // Carica ricette casuali all'avvio
  useEffect(() => {
    async function loadRandom() {
      try {
        const res = await fetch(`${API_URL}/recipes/random/4`);
        if (!res.ok) throw new Error("Errore fetch random");
        const data = await res.json();
        setRecipes(data);
        setSearching(false);
      } catch (err) {
        console.error("Errore caricamento random:", err);
      }
    }
    loadRandom();
  }, []);

  // Funzione di ricerca
  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const res = await fetch(`${API_URL}/recipes/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Errore ricerca");
      const data = await res.json();
      setRecipes([...data.local, ...data.external]);
      setSearching(true);
    } catch (error) {
      console.error("Errore durante la ricerca:", error);
      setRecipes([]);
    }
  };

  // se il campo di ricerca è vuoto, mostra ricette casuali
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === "") {
      setSearching(false);
      (async () => {
        const res = await fetch(`${API_URL}/recipes/random/4`);
        const data = await res.json();
        setRecipes(data);
      })();
    }
  };

  return (
    <div style={{ backgroundColor: "#f9f9f9", color: "#222", minHeight: "100vh" }}>
      <Navbar />

      {/* ricerca */}
      <div
        className="text-center py-5 shadow-sm"
        style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e0e0e0" }}
      >
        <h1
          className="fw-bold"
          style={{ color: "#d60909", letterSpacing: "1px", fontSize: "2.2rem" }}
        >
          Scopri nuove ricette ogni giorno 🍝
        </h1>
        <p className="text-secondary mt-3 fs-5">
          Cerca, esplora e condividi piatti da tutto il mondo
        </p>

        <div className="mt-4 d-flex justify-content-center">
          <input
            type="text"
            className="form-control shadow-sm"
            placeholder="Cerca una ricetta..."
            value={query}
            onChange={handleInputChange}
            style={{
              width: "50%",
              maxWidth: "450px",
              borderRadius: "8px 0 0 8px",
              border: "1px solid #ccc",
              padding: "10px 15px",
            }}
          />
          <button
            onClick={handleSearch}
            className="fw-bold shadow-sm"
            style={{
              backgroundColor: "#d60909",
              color: "white",
              border: "none",
              borderRadius: "0 8px 8px 0",
              padding: "10px 20px",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#b20707")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#d60909")}
          >
            Cerca
          </button>
        </div>
      </div>

      {/* Ricette */}
      <div className="container py-5">
        <h3
          className="mb-4 text-center fw-bold"
          style={{ color: "#d60909", letterSpacing: "0.5px" }}
        >
          {searching ? "Risultati della ricerca" : "Ricette in evidenza"}
        </h3>

        {recipes.length === 0 ? (
          <p className="text-center text-secondary fs-5">Nessuna ricetta trovata.</p>
        ) : (
          <div className="row justify-content-center">
            {recipes.map((r, i) => (
              <div key={i} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                <div
                  className="hover-scale shadow-sm"
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <RecipeCard
                    title={r.titolo || r.strMeal}
                    image={r.imageUrl || r.strMealThumb}
                    onClick={() => navigate(`/recipe/${r._id || r.idMeal}?source=${r._id ? "local" : "external"}`)}

                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
