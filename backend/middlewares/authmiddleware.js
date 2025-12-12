// Importa il modulo 'jsonwebtoken' per la gestione
const jwt = require('jsonwebtoken');
// Carica la chiave segreta dall'ambiente di esecuzione 
// Questa chiave DEVE essere mantenuta segreta e utilizzata anche per firmare i token
const SECRET = process.env.JWT_SECRET;

//Funzione middleware di autenticazione
function authMiddleware(req, res, next) {

    // Ottiene l'header 'Authorization' dalla richiesta.
    // L'header è tipicamente nel formato: "Bearer <token>".
    const authHeader = req.headers['authorization'];

    // Controlla se l'header 'Authorization' è presente.
    if (!authHeader) return res.status(401).json({ message: "Token mancante" });

    const token = authHeader.split(' ')[1];
    // Se manca, restituisce un errore 401 e blocca la richiesta.
    if (!token) return res.status(401).json({ message: "Token non valido" });

    //VERIFICA DEL TOKEN
    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        //console.log("Token verificato:", decoded);

        // Chiama 'next()' per passare il controllo alla funzione middleware o al gestore di route successivo.
        next();
    } catch (error) {
        //GESTIONE DEGLI ERRORI
        return res.status(403).json({ message: "Token non valido o scaduto" });
    }
}
// Esporta la funzione middleware per poterla utilizzare nelle definizioni delle route.
module.exports = authMiddleware;