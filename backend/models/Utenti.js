const mongoose = require('mongoose');

const Utenti = new mongoose.Schema({
            
            username: { type: String, required: true, unique: true },
            email: { type: String, required: true, unique: true },
            passwordHash: { type: String, required: true },
            nome: { type: String, required: true },
            cognome: { type: String, required: true },
            dataNascita: { type: Date, required: true },
            piattiPreferiti: { type: [String] },
            ricettario: [
                {
                    ricettaId: { type: String },
                    source: { type: String, enum: ['external', 'local'], default: 'local' }
                }
            ],
            createdAt: { type: Date, default: Date.now }
        });

module.exports = mongoose.model('Utenti', Utenti);

