// Importa il framework Express.
const express = require('express');

// Importa la libreria per l'hashing delle password.
const bcrypt = require('bcryptjs');

// Importa il modello Mongoose 'Utenti' 
const Utenti = require('../models/Utenti');
// Crea un'istanza di Express Router
const router = express.Router();
// Importa il middleware di autenticazione (JWT)
const authMiddleware = require('../middlewares/authMiddleware');


// Importa il modulo e recupera la chiave segreta
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

// Funzione helper per l'hashing asincrono della password.
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

// Middleware personalizzato per controllare i conflitti
const Controllo409 = async (req, res, next) => {
    const { username, email } = req.body;

    try{
        const user = await Utenti.findOne({ $or: [{ username }, { email }] });
    if (user) {
    // Indica quale campo è in conflitto per feedback più preciso
    let conflict = 'username or email';
    if (username && user.username === username) conflict = 'username';
    else if (email && user.email === email) conflict = 'email';
    return res.status(409).json({ message: `Conflitto: ${conflict} già in uso`, field: conflict });
    }
    // Se non ci sono conflitti, passa al gestore successivo
    next();
    } catch (error) {
        console.error("Errore durante il controllo dell'utente:", error);
        res.status(500).json({ message: "Errore interno del server" });
    }
};

// Route POST per la registrazione. Il middleware Controllo409 viene eseguito per primo.
router.post('/register',Controllo409, async (req, res) => {
    const { username, password, email, nome, cognome, dataNascita, piattiPreferiti, ricettario } = req.body;

    try{
      //Hashing della password.
        const hashedPassword = await hashPassword(password);
// Creazione di una nuova istanza del modello Utenti.
        const newUser = new Utenti({
            username,
            passwordHash: hashedPassword,
            email,
            nome,
            cognome,
            dataNascita,
            piattiPreferiti,
            ricettario
        });
// Salvataggio dell'utente nel database MongoDB.
        await newUser.save();
// Risposta con status 201 .
        res.status(201).json({ message: "Registrazione avvenuta con successo" });
    }catch (error) {
    console.error("Errore durante la registrazione:", error);
    // Se è un errore di validazione di Mongoose, restituisci 400 con dettagli
    if (error && error.name === 'ValidationError') {
      const details = {};
      for (const key in error.errors) {
        details[key] = error.errors[key].message;
      }
      return res.status(400).json({ message: 'Dati di registrazione non validi', details });
    }
    res.status(500).json({ message: "Errore interno del server" });
    }
});


// Route per l'accesso.
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

  try {
    //  Cerca l'utente per username.
    const user = await Utenti.findOne({ username });
    if (!user) return res.status(401).json({ message: "Credenziali non valide" });

    // Confronta la password fornita con l'hash memorizzato nel database.
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Credenziali non valide" });

    
    // Generazione del JWT.
    const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: "Login effettuato con successo", token });
  } catch (error) {
    console.error("Errore durante il login:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

// Route per il cambio password.
router.post('/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await Utenti.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Utente non trovato" });

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Password attuale errata" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password aggiornata con successo" });
  } catch (error) {
    console.error("Errore cambio password:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
});





// Esporta il router per essere utilizzato nell'applicazione principale (server.js o app.js).
module.exports = router;