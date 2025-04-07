const express = require('express');
const Don = require('../models/Don');  // Import du modèle Don
const router = express.Router();

// Ajouter un don
router.post('/dons', async (req, res) => {
  const { titre, description, url_image, ville_don, categorie_id, cree_par } = req.body;
  
  try {
    const don = new Don({
      titre,
      description,
      url_image,
      ville_don,
      categorie_id,
      cree_par
    });
    
    await don.save();
    res.status(201).json(don);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création du don', error });
  }
});

// Modifier un don
router.put('/dons/:id', async (req, res) => {
  try {
    const don = await Don.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!don) return res.status(404).json({ message: 'Don introuvable' });
    res.status(200).json(don);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour du don', error });
  }
});

// Supprimer un don
router.delete('/dons/:id', async (req, res) => {
  try {
    const don = await Don.findByIdAndDelete(req.params.id);
    if (!don) return res.status(404).json({ message: 'Don introuvable' });
    res.status(200).json({ message: 'Don supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la suppression du don', error });
  }
});

// Réserver un don
router.put('/dons/:id/reserver', async (req, res) => {
  const { reserve_par } = req.body;
  
  try {
    const don = await Don.findById(req.params.id);
    if (!don) return res.status(404).json({ message: 'Don introuvable' });
    
    don.statut = 'reserve';
    don.reserve_par = reserve_par;
    don.mis_a_jour_le = Date.now();
    
    await don.save();
    res.status(200).json(don);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la réservation du don', error });
  }
});

// Lister les dons (actifs et archivés)
router.get('/dons', async (req, res) => {
  try {
    const dons = await Don.find({ statut: { $in: ['actif', 'archive'] } });
    res.status(200).json(dons);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la récupération des dons', error });
  }
});

module.exports = router;
