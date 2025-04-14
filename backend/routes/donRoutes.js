const express = require('express');
const multer = require('multer');
const path = require('path');
const Don = require('../models/Don'); 
const router = express.Router();

// Configurer multer pour stocker l'image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Créer un don
router.post('/dons', upload.single('image'), async (req, res) => {
  try {
    const { titre, categorie, description, ville_don } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const newDon = new Don({
      titre,
      categorie,
      description,
      ville_don,
      url_image: imageUrl
    });

    await newDon.save();
    res.status(200).json({ message: 'Don créé avec succès', Don: newDon });
  } catch (error) {
    console.error('Erreur lors de la création du don:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🔥 Récupérer tous les dons
router.get('/dons', async (req, res) => {
  try {
    const dons = await Don.find();
    res.status(200).json(dons);
  } catch (error) {
    console.error('Erreur lors de la récupération des dons:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
