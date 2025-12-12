// importa la libreria per la modellazione di oggetti MongoDB per Node.js
const mongoose = require('mongoose');

// Definisce un nuovo schema Mongoose per la collezione 'Recensioni'
const Recensioni = new mongoose.Schema({

            //riferimento a utente che ha lasciato recensione
            utenteID: { type: mongoose.Schema.Types.ObjectId, ref: 'Utenti', required: true },
            // Riferimento alla ricetta locale che ha il collegamento alla recensione
            ricettaID: { type: mongoose.Schema.Types.ObjectId, ref: 'Ricette' },
            // Campo per memorizzare l'ID univoco di una ricetta
            externalId: { type: String },
            // Definisce la provenienza della ricetta recensita.
            fonte: { type: String, enum: ['local', 'external'], required: true },
            // Valutazione del gusto 
            gusto: { type: Number, min: 1, max: 5, required: true },
            // Valutazione della difficoltà di preparazione 
            difficolta: { type: Number, min: 1, max: 5, required: true },
            // Il commento testuale lasciato dall'utente 
            note: { type: String, required: true },
            // Timestamp di creazione della recensione
            createdAt: { type: Date, default: Date.now }
        });
// Esporta il modello Mongoose.
module.exports = mongoose.model('Recensioni', Recensioni);