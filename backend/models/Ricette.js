const mongoose = require('mongoose');
// Definisce un nuovo schema Mongoose per la collezione 'Ricette'
const Ricette = new mongoose.Schema({
    // 1 titolo della ricetta, 2 descrizione, 3 ingredienti, 4istruzioni per cucinare, 5 immagine del piatto, 6 autore della ricetta, 7 data di creazione
            titolo: { type: String, required: true },
            descrizione: { type: String, required: true },
            ingredienti: { type: [String], required: true },
            istruzioni: { type: String, required: true },
            imageUrl: { type: String, default: null },
            autore: { type: mongoose.Schema.Types.ObjectId, ref: 'Utenti', required: true },
            createdAt: { type: Date, default: Date.now }
        });
        
module.exports = mongoose.model('Ricette', Ricette);