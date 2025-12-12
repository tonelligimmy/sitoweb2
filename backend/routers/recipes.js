const express = require('express');
const axios = require('axios');
const Ricette = require('../models/Ricette');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const MEALDB_URL = "https://www.themealdb.com/api/json/v1/1";

router.get('/random/:count?', async (req, res) => {
  try {
    const count = Math.min(parseInt(req.params.count || "1", 10), 10);
    const promises = [];
    for (let i = 0; i < count; i++) {
      promises.push(axios.get(`${MEALDB_URL}/random.php`));
    }
    const results = await Promise.all(promises);
    const meals = results.flatMap(r => r.data.meals);

    res.json(meals);
  } catch (error) {
    console.error("Errore fetch random:", error);
    res.status(500).json({ error: "Errore fetch random" });
  }
});

router.get('/recipeBook', authMiddleware, async (req, res) => {
  try {
    const ricette = await Ricette.find({ autore: req.user.id });
    res.status(200).json(ricette);
  } catch (error) {
    console.error("Errore durante il recupero delle ricette:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

router.get('/search', async (req,res)=>{

    const { q } = req.query;
    if(!q){
        return res.status(400).json({ error: 'Parametro di ricerca mancante' });
    }

    try{

        const LocalOutput = await Ricette.find({ titolo: { $regex: q, $options: 'i' } });

        const response = await axios.get(`${MEALDB_URL}/search.php?s=${q}`);
        const externalOutput = response.data.meals || [];

        res.json({ local: LocalOutput, external: externalOutput });
    }catch(error){
        console.error("Errore durante la ricerca delle ricette:", error);
        res.status(500).json({ error: 'Errore del server durante la ricerca delle ricette' });
    }
});

router.post('/local', authMiddleware, async (req, res) => {
    const { titolo, descrizione, ingredienti, istruzioni, imageUrl } = req.body;
    try {
        const nuovaRicetta = await Ricette.create({
            titolo,
            descrizione,
            ingredienti,
            istruzioni,
            imageUrl,
            autore: req.user.id,
            createdAt: new Date()
        });

        res.status(201).json(nuovaRicetta);
    } catch (error) {
        console.error("Errore durante la creazione della ricetta:", error);
        res.status(500).json({ message: "Errore interno del server" });
    }
});

router.get('/external/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${MEALDB_URL}/lookup.php?i=${id}`);

    if (!response.data.meals || response.data.meals.length === 0) {
      return res.status(404).json({ message: "Ricetta esterna non trovata" });
    }

    res.status(200).json(response.data.meals[0]);
  } catch (error) {
    console.error("Errore nel recupero della ricetta esterna:", error);
    res.status(500).json({ message: "Errore nel recupero della ricetta esterna" });
  }
});

router.get('/local/:id', async (req, res) => {
  try {
    const ricetta = await Ricette.findById(req.params.id);
    if (!ricetta) return res.status(404).json({ message: "Ricetta non trovata" });
    res.status(200).json(ricetta);
  } catch (error) {
    console.error("Errore durante il recupero della ricetta:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

router.patch('/local/:id', authMiddleware, async (req, res) => {
  try {
    const ricetta = await Ricette.findById(req.params.id);
    if (!ricetta) return res.status(404).json({ message: "Ricetta non trovata" });

    if (ricetta.autore.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorizzato" });
    }

    Object.assign(ricetta, req.body);
    await ricetta.save();

    res.json(ricetta);
  } catch (error) {
    console.error("Errore aggiornamento ricetta:", error);
    res.status(500).json({ message: "Errore interno server" });
  }
});


router.delete('/local/:id', authMiddleware, async (req, res) => {
    try{
        const ricetta = await Ricette.findById(req.params.id);
        if (!ricetta) return res.status(404).json({ message: "Ricetta non trovata" });

        if (ricetta.autore.toString() !== req.user.id) {
        return res.status(403).json({ message: "Non autorizzato a eliminare questa ricetta" });
        }

    await ricetta.deleteOne();
    res.status(200).json({ message: "Ricetta eliminata con successo" });
    } catch (error) {
        console.error("Errore durante l'eliminazione della ricetta:", error);
        res.status(500).json({ message: "Errore interno del server" });
    }
    
});



module.exports = router;