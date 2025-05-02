const express = require('express');
const multer = require('multer');
const path = require('path');
const Don = require('../models/Don');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');

const {
  createDon,
  getAllDons,
  updateDon,
  deleteDon,
  getDonById,
  getDons,
  prendreDon,
  getArchiveDon,
  unarchiveDon,
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
router.post('/', verifyToken, upload.single('url_image'), createDon);

router.post('/:id/prendre', verifyToken, prendreDon);


// ✅ Obtenir tous les dons
router.get('/', getAllDons);


// ✅ Archiver un don (via le contrôleur `archiveDon`)
router.put('/:id/archives', verifyToken, getArchiveDon);

router.put('/:id/desarchiver', verifyToken, unarchiveDon);

// ✅ Récupérer les dons archivés
router.get('/archives', getArchiveDon);

// ✅ Obtenir un don par ID
router.get('/:id', getDonById);
 
// ✅ Modifier un don
router.put('/:id', upload.single('url_image'), updateDon);

// ✅ Supprimer un don
router.delete('/:id', deleteDon);

// ✅ Récupérer les dons par catégorie
router.get('/categorie/:categorie', getDons);




module.exports = router;
