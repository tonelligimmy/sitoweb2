const express = require('express');
const Utenti = require('../models/Utenti');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me', authMiddleware, async (req, res)=>{

    try{
        const user = await Utenti.findById(req.user.id).select('-passwordHash');
        if(!user) return res.status(404).json({ message: "Utente non trovato" });
        res.status(200).json(user);
    } catch (error) {
        console.error("Errore durante il recupero dell'utente:", error);
        res.status(500).json({ message: "Errore interno del server" });
    }

});

router.patch('/me', authMiddleware, async (req, res)=>{

    try{
        const updates = req.body;
        const updateUser = await Utenti.findByIdAndUpdate(req.user.id, {$set: updates}, {new: true}).select('-passwordHash');
        //console.log("Utente aggiornato:", updateUser);
        if(!updateUser) return res.status(404).json({ message: "Utente non trovato" });
        res.status(200).json(updateUser);
    } catch (error) {
        console.error("Errore durante l'aggiornamento dell'utente:", error);
        res.status(500).json({ message: "Errore interno del server" });
    }

});

router.delete('/me', authMiddleware, async (req, res)=>{

    try{

        const deleteUser = await Utenti.findByIdAndDelete(req.user.id);
        if (!deleteUser) return res.status(404).json({ message: "Utente non trovato" });
        res.status(200).json({ message: "Utente eliminato con successo" });
    } catch (error) {
        console.error("Errore durante l'eliminazione dell'utente:", error);
        res.status(500).json({ message: "Errore interno del server" });
    }

});


module.exports = router; 