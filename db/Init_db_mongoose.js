const mongoose = require('mongoose');

async function initDB(){

    try{
        await mongoose.connect('mongodb://localhost:27017/ProgUni', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('Connessione effettuata');

        //CREAZIONE COLLECTION UTENTI
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
        //CREAZIONE COLLECTION RICETTE
        const Ricette = new mongoose.Schema({
            titolo: { type: String, required: true },
            descrizione: { type: String, required: true },
            ingredienti: { type: [String], required: true },
            istruzioni: { type: String, required: true },
            imageUrl: { type: String, required: true },
            autore: { type: mongoose.Schema.Types.ObjectId, ref: 'Utenti', required: true },
            createdAt: { type: Date, default: Date.now }
        });
        //CREAZIONE COLLECTION RECENSIONI
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

        const Utente = mongoose.model('Utenti', Utenti);
        const Ricetta = mongoose.model('Ricette', Ricette);
        const Recensione = mongoose.model('Recensioni', Recensioni);

        console.log("Collections create");
        
        // --- INSERIMENTI DEMO ---
        const user = await Utente.create({
            username: "demoUser",
            email: "demo@example.com",
            passwordHash: "hashFittizio",
            nome: "Mario",
            cognome: "Rossi",
            dataNascita: new Date("1990-01-01"),
            piattiPreferiti: ["Pizza", "Carbonara"]
        });

        const ricetta = await Ricetta.create({
            titolo: "Ricetta Demo",
            descrizione: "Ricetta di test",
            ingredienti: ["acqua", "sale"],
            istruzioni: "Butta la pasta (non nel cestino)",
            imageUrl: "http://example.com/immagine.jpg",
            autore: "68b464dec092b9e35f82defa"
        });

        const nuovaRecensionelocal = await Recensione.create({
            utenteID: "68b464dec092b9e35f82defa",   
            ricettaID: "68b477ae70cc71c217d6df85", 
            fonte: "local",
            gusto: 4,
            difficolta: 3,
            note: "Ottima ricetta, semplice ma gustosa!"
        });

        
        const nuovaRecensioneexternal = await Recensione.create({
            utenteID: "68b464dec092b9e35f82defa", 
            externalId: "52772",                  
            fonte: "external",
            gusto: 5,
            difficolta: 2,
            note: "Ricetta trovata su MealDB, molto buona!"
        });

        console.log("Dati di demo inseriti");
        process.exit(0);
        
    } catch (error) {
            console.error('Errore di connessione al database:', error);
            process.exit(1);
        }
}

initDB();