require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const authRouter = require('./routers/auth');
const usersRouter = require('./routers/users');
const reviewsRouter = require('./routers/reviews');
const recipesRouter = require('./routers/recipes');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ProgUni')
.then(() => {
    console.log("Connessione al database avvenuta con successo");
})
.catch((error) => {
    console.error("Errore di connessione al database:", error);
});

app.use(express.static(path.resolve(__dirname, '../frontend/build')));

// Abilita CORS per il dev server frontend e per richieste locali
app.use(cors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/recipes', recipesRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});

