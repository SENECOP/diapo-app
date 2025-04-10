const express = require('express');
const multer = require('multer');
const path = require('path');
const Don = require('../models/Don'); 
const router = express.Router();

// Configurer multer pour stocker l'image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier où les fichiers seront stockés
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ajouter un timestamp pour éviter les conflits
  }
});

const upload = multer({ storage: storage });


router.post('/dons', upload.single('image'), async (req, res) => {
  try {
    // Récupérer les données du formulaire et l'image
    console.log("Données reçues :", req.body); // Vérifier les données envoyées
    console.log("Fichier :", req.file);
    const { titre, categorie, description, ville_don } = req.body;
    const imageUrl = req.file ? req.file.path : null; // Si un fichier a été téléchargé, l'URL de l'image est ici

    // Créer un don dans la base de données
    const newDon = new Don({
      titre,
      categorie,
      description,
      ville_don,
      url_image: imageUrl
    });

    // Sauvegarder le don
    await newDon.save();

    res.status(200).json({ message: 'Don créé avec succès', Don: newDon });
  } catch (error) {
    console.error('Erreur lors de la création du don:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
