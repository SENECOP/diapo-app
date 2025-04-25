const express = require('express');
const multer = require('multer');
const path = require('path');
const Don = require('../models/Don');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const {
  getDons,
  updateDon,
  deleteDon,
  archiveDon,
} = require('../controllers/donApi');

// Configuration Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

/**
 * ROUTES
 */

// ✅ Créer un don
router.post('/', verifyToken, upload.single('url_image'), async (req, res) => {
  try {
    const { titre, categorie, description, ville_don, user } = req.body;
    const imagePath = req.file ? `uploads/${req.file.filename}` : null;

    const newDon = await Don.create({
      titre,
      categorie,
      description,
      ville_don,
      url_image: imagePath,
      user,
    });

    res.status(201).json(newDon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ Obtenir tous les dons
router.get('/', async (req, res) => {
  try {
    const dons = await Don.find();
    res.status(200).json(dons);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ Archiver un don (via le contrôleur `archiveDon`)
router.put('/:id/archives', verifyToken, archiveDon);


// ✅ Récupérer les dons archivés
router.get('/archives', async (req, res) => {
  try {
    const donsArchives = await Don.find({ archived: true });
    res.json(donsArchives);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Obtenir un don par ID
router.get('/:id', async (req, res) => {
  try {
    const don = await Don.findById(req.params.id);
    if (!don) {
      return res.status(404).json({ message: 'Don non trouvé' });
    }
    res.json(don);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


// ✅ Modifier un don
router.put('/:id', upload.single('url_image'), async (req, res) => {
  try {
    const { titre, categorie, description, ville_don, user } = req.body;
    const imagePath = req.file ? `uploads/${req.file.filename}` : null;

    const don = await Don.findById(req.params.id);
    if (!don) {
      return res.status(404).json({ error: 'Don non trouvé' });
    }

    don.titre = titre || don.titre;
    don.categorie = categorie || don.categorie;
    don.description = description || don.description;
    don.ville_don = ville_don || don.ville_don;
    don.url_image = imagePath || don.url_image;
    don.user = user || don.user;

    await don.save();
    res.status(200).json(don);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ Supprimer un don
router.delete('/:id', async (req, res) => {
  try {
    const don = await Don.findByIdAndDelete(req.params.id);
    if (!don) {
      return res.status(404).json({ error: 'Don non trouvé' });
    }
    res.status(200).json({ message: 'Don supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ Récupérer les dons par catégorie
router.get('/categorie/:categorie', async (req, res) => {
  try {
    const { categorie } = req.params;
    let dons;

    if (categorie.toLowerCase() === "nouveautes") {
      dons = await Don.find().sort({ date: -1 }).limit(5);
    } else {
      dons = await Don.find({ categorie: { $regex: new RegExp(categorie, "i") } });
    }

    res.json(dons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




module.exports = router;
