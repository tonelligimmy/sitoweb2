const mongoose = require('mongoose');

const Recensioni = new mongoose.Schema({
            utenteID: { type: mongoose.Schema.Types.ObjectId, ref: 'Utenti', required: true },
            ricettaID: { type: mongoose.Schema.Types.ObjectId, ref: 'Ricette' },
            externalId: { type: String },
            fonte: { type: String, enum: ['local', 'external'], required: true },
            gusto: { type: Number, min: 1, max: 5, required: true },
            difficolta: { type: Number, min: 1, max: 5, required: true },
            note: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        });

module.exports = mongoose.model('Recensioni', Recensioni);