const express = require('express');
const Recensioni = require('../models/Recensioni');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { fonte } = req.query;

  if (!fonte || !['local', 'external'].includes(fonte)) {
    return res
      .status(400)
      .json({ message: "Parametro 'fonte' mancante o non valido (local|external)" });
  }

  try {
    let recensioni = [];

    if (fonte === 'local') {
      recensioni = await Recensioni.find({ ricettaID: id })
        .populate('utenteID', 'username');
    } else if (fonte === 'external') {
      recensioni = await Recensioni.find({ externalId: id })
        .populate('utenteID', 'username');
    }

    return res.status(200).json(recensioni);
  } catch (error) {
    console.error('Errore durante il recupero delle recensioni:', error);
    return res
      .status(500)
      .json({ message: 'Errore interno del server durante il recupero recensioni' });
  }
});


router.post('/', authMiddleware, async (req, res) => {
  try {
    const { ricettaID, fonte, externalId, gusto, difficolta, note } = req.body;

    if (!fonte || !['local', 'external'].includes(fonte)) {
      return res
        .status(400)
        .json({ message: "Fonte non valida: deve essere 'local' o 'external'" });
    }

    if (fonte === 'local' && !ricettaID) {
      return res.status(400).json({ message: "Manca ricettaID per fonte=local" });
    }

    if (fonte === 'external' && !externalId) {
      return res.status(400).json({ message: "Manca externalId per fonte=external" });
    }

    const nuovaRecensione = await Recensioni.create({
      utenteID: req.user.id,
      ricettaID: fonte === 'local' ? ricettaID : undefined,
      externalId: fonte === 'external' ? externalId : undefined,
      fonte,
      gusto,
      difficolta,
      note,
      createdAt: new Date(),
    });

    return res.status(201).json(nuovaRecensione);
  } catch (error) {
    console.error('Errore durante la creazione della recensione:', error);
    return res.status(500).json({ message: 'Errore interno del server' });
  }
});


router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { fonte } = req.query;

  if (!fonte || !['local', 'external'].includes(fonte)) {
    return res
      .status(400)
      .json({ message: "Parametro 'fonte' mancante o non valido (local|external)" });
  }

  try {
    const recensione = await Recensioni.findOne({ _id: id, fonte });

    if (!recensione) {
      return res.status(404).json({ message: 'Recensione non trovata' });
    }

    if (recensione.utenteID.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorizzato a eliminare questa recensione' });
    }

    await recensione.deleteOne();
    return res.status(200).json({ message: 'Recensione eliminata con successo' });
  } catch (error) {
    console.error('Errore durante l\'eliminazione della recensione:', error);
    return res.status(500).json({ message: 'Errore interno del server' });
  }
});

module.exports = router;
