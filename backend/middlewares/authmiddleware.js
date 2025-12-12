const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: "Token mancante" });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Token non valido" });

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        //console.log("Token verificato:", decoded);
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token non valido o scaduto" });
    }
}

module.exports = authMiddleware;