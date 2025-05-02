const express = require('express');
const multer = require('multer');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const donController = require('../controllers/donApi');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

/**
 * ROUTES PROPREMENT ORGANISÉES
 */
router.post('/', verifyToken, upload.single('url_image'), donController.createDon);
router.get('/', donController.getDons);
router.get('/:id', donController.getDonById);
router.put('/:id', verifyToken, upload.single('url_image'), donController.updateDon);
router.delete('/:id', verifyToken, donController.deleteDon);

router.post('/:id/prendre', verifyToken, donController.prendreDon);
router.put('/:id/archives', verifyToken, donController.archiveDon);
router.put('/:id/desarchiver', verifyToken, donController.unarchiveDon);

// Optionnel : récupérer uniquement les dons archivés
router.get('/archives', async (req, res) => {
  try {
    const donsArchives = await Don.find({ archived: true });
    res.json(donsArchives);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Dons par catégorie (idéalement à déplacer aussi dans le contrôleur)
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
