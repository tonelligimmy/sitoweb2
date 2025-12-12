const express = require('express');
const bcrypt = require('bcryptjs');
const Utenti = require('../models/Utenti');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

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
    next();
    } catch (error) {
        console.error("Errore durante il controllo dell'utente:", error);
        res.status(500).json({ message: "Errore interno del server" });
    }
};


router.post('/register',Controllo409, async (req, res) => {
    const { username, password, email, nome, cognome, dataNascita, piattiPreferiti, ricettario } = req.body;

    try{
        const hashedPassword = await hashPassword(password);

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

        await newUser.save();

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



router.post('/login', async (req, res) => {
    const { username, password } = req.body;

  try {
    const user = await Utenti.findOne({ username });
    if (!user) return res.status(401).json({ message: "Credenziali non valide" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Credenziali non valide" });

    const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: "Login effettuato con successo", token });
  } catch (error) {
    console.error("Errore durante il login:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
});


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






module.exports = router;