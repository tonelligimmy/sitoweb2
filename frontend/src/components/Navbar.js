// Importa la libreria React 
import React, { useState } from "react";
// Importa un modulo di servizio che gestisce la logica di autenticazione
//  (es. login, logout, check autenticazione).
import auth from "../services/auth";
// Importa Link per la navigazione tra le pagine senza ricaricare
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  //visibilità del menu a tendina del profilo
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
// Funzione gestore per il logout
  const handleLogout = () => {
    // Chiama la funzione di logout
    auth.logout();
    //Porta l'utente alla pagina di login.
    navigate("/login");
  };

  return (
    // Elemento principale della barra di navigazione e sfrutta le classi di CSS
    <nav
      className="navbar shadow-sm px-4 py-3"
      style={{
        backgroundColor: "#fff8f6", 
        borderBottom: "2px solid #f0e4dd",
      }}
    >
      {/* Nome sito,  Emoji: 🍳*/}
      <span
        className="navbar-brand fw-bold fs-4"
        style={{
          color: "#d60909",
          letterSpacing: "1px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        🍳 MyRecipeSite
      </span>

      {/* Icona profilo, Emoji: 👤 */}
      <div className="position-relative">
        <i
          className="bi bi-person-circle fs-3"
          style={{ color: "#2e2e2e", cursor: "pointer" }}
          onClick={() => setOpen(!open)}
          title="Profilo"
        ></i>

        {/* Menu a tendina, Emoji da usare: 🔑 🧾 👤 🚪*/}
        {open && (
          <div
            className="position-absolute end-0 mt-2 shadow-lg"
            style={{
              backgroundColor: "#fffdfb",
              border: "1px solid #e0d5cd",
              borderRadius: "10px",
              minWidth: "180px",
              zIndex: 1000,
              animation: "fadeIn 0.2s ease-in-out",
            }}
          >
            {!auth.isLoggedIn() ? (
              <>
                <Link
                  to="/login"
                  className="dropdown-item text-center py-2 fw-semibold"
                  style={{
                    color: "#2e2e2e",
                    textDecoration: "none",
                    borderBottom: "1px solid #eee",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) => (e.target.style.background = "#f4ede4")}
                  onMouseOut={(e) => (e.target.style.background = "transparent")}
                  onClick={() => setOpen(false)}
                >
                  🔑 Login
                </Link>
                <Link
                  to="/register"
                  className="dropdown-item text-center py-2 fw-semibold"
                  style={{
                    color: "#2e2e2e",
                    textDecoration: "none",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) => (e.target.style.background = "#f4ede4")}
                  onMouseOut={(e) => (e.target.style.background = "transparent")}
                  onClick={() => setOpen(false)}
                >
                  🧾 Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="dropdown-item text-center py-2 fw-semibold"
                  style={{
                    color: "#2e2e2e",
                    textDecoration: "none",
                    borderBottom: "1px solid #eee",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) => (e.target.style.background = "#f4ede4")}
                  onMouseOut={(e) => (e.target.style.background = "transparent")}
                  onClick={() => setOpen(false)}
                >
                  👤 Profilo
                </Link>
                <button
                  className="dropdown-item text-center py-2 fw-semibold w-100"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#d60909",
                    transition: "background 0.2s, color 0.2s",
                  }}
                  onMouseOver={(e) => (e.target.style.background = "#fff2f2")}
                  onMouseOut={(e) => (e.target.style.background = "transparent")}
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Animazione CSS */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </nav>
  );
}

export default Navbar;
