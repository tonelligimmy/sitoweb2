// Importa la libreria React .
import React, { useState } from "react";
// Importa il componente Navbar per la navigazione.
import Navbar from "../components/Navbar";
// Importa il modulo di autenticazione per recuperare il token necessario per l'API.
import auth from "../services/auth";
// Importa l'hook per la navigazione programmatica.
import { useNavigate } from "react-router-dom";

// Definizione dell'URL base per le chiamate API del backend.
const API_URL = "http://localhost:3000/api";

// Componente funzionale principale.

function AddRecipePage() {
    const navigate = useNavigate();
    // Hook di stato per memorizzare i dati del form
    const [form, setForm] = useState({
        titolo: "",
        descrizione: "",
        ingredienti: "",
        istruzioni: "",
        imageUrl: "",
    });
    // Hook di stato per il feedback visivo durante la API
    const [loading, setLoading] = useState(false);

   // Gestisce il cambiamento di input in tutti i campi 
    const handleChange = (e) => {
       
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Gestisce l'invio del form.
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validazione lato client: controlla che i campi obbligatori non siano vuoti.
        if (
            !form.titolo.trim() ||
            !form.descrizione.trim() ||
            !form.ingredienti.trim() ||
            !form.istruzioni.trim()
        ) {
            alert("Tutti i campi obbligatori devono essere compilati.");
            return;
        }

        setLoading(true); // Imposta lo stato di caricamento su true.

        try {
            // Conversione della stringa di ingredienti in un array di stringhe.
            const ingredientsArray = form.ingredienti
           
            .split(",")
            .map((i) => i.trim())
            .filter((i) => i.length > 0); 

            // Esegue la chiamata dopo all'API del backend.
            const res = await fetch(`${API_URL}/recipes/local`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //  Invia il token JWT per l'autenticazione sul backend.
                Authorization: `Bearer ${auth.getToken()}`,
            },
            body: JSON.stringify({
                titolo: form.titolo,
                descrizione: form.descrizione,
                ingredienti: ingredientsArray, // Invia l'array preparato.
                istruzioni: form.istruzioni,
                // Assicura che imageUrl sia null se l'input è vuoto.
                imageUrl: form.imageUrl?.trim() || null, 
            }),
            });

            // Gestione degli errori HTTP 
            if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);

            const data = await res.json();
            console.log("Ricetta salvata:", data);

           
            alert("✅ Ricetta aggiunta con successo!");
            navigate("/profile");
            
        } catch (error) {
            // Gestione di tutti gli altri errori 
            console.error("❌ Errore durante la creazione della ricetta:", error);
            alert("Errore durante la creazione della ricetta");
        } finally {
            setLoading(false); // Reimposta lo stato di caricamento indipendentemente dal successo/fallimento.
        }
    };
       

    return (
        // Contenitore principale degli stili di sfondo
        <div style={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
            <Navbar />

            <div className="container py-5">
                <h2 className="fw-bold text-center mb-4" style={{ color: "#d60909" }}>
                    Aggiungi una nuova ricetta 🍳
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="card shadow-sm border-0 p-4 mx-auto"
                    style={{ maxWidth: "700px", backgroundColor: "#fff" }}
                >
                    <div className="mb-3">
                        <label className="form-label">Titolo</label>
                        <input
                            required
                            type="text"
                            name="titolo"
                            className="form-control"
                            value={form.titolo}
                            onChange={handleChange}
                            placeholder="Inserisci il titolo della ricetta"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Descrizione</label>
                        <textarea
                            required
                            name="descrizione"
                            className="form-control"
                            rows="3"
                            value={form.descrizione}
                            onChange={handleChange}
                            placeholder="Una breve descrizione della ricetta"
                        ></textarea>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Ingredienti</label>
                        <textarea
                            required
                            name="ingredienti"
                            className="form-control"
                            rows="3"
                            value={form.ingredienti}
                            onChange={handleChange}
                            placeholder="Inserisci gli ingredienti separati da una virgola"
                        ></textarea>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Istruzioni</label>
                        <textarea
                            required
                            name="istruzioni"
                            className="form-control"
                            rows="4"
                            value={form.istruzioni}
                            onChange={handleChange}
                            placeholder="Descrivi passo dopo passo la preparazione"
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Immagine (URL)</label>
                        <input
                            type="text"
                            name="imageUrl"
                            className="form-control"
                            value={form.imageUrl}
                            onChange={handleChange}
                            placeholder="Inserisci un link all'immagine (opzionale)"
                        />
                    </div>

                    <div className="d-flex justify-content-between">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => navigate("/profile")}
                        >
                            ← Torna al profilo
                        </button>

                        <button
                            type="submit"
                            className="btn fw-bold"
                            style={{ backgroundColor: "#d60909", color: "white" }}
                            disabled={loading}
                        >
                            {loading ? "Salvataggio..." : "➕ Aggiungi ricetta"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddRecipePage;
