const mongoose = require('mongoose');

const Ricette = new mongoose.Schema({
            titolo: { type: String, required: true },
            descrizione: { type: String, required: true },
            ingredienti: { type: [String], required: true },
            istruzioni: { type: String, required: true },
            imageUrl: { type: String, default: null },
            autore: { type: mongoose.Schema.Types.ObjectId, ref: 'Utenti', required: true },
            createdAt: { type: Date, default: Date.now }
        });
        
module.exports = mongoose.model('Ricette', Ricette);