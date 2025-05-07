const express = require('express');
const multer = require('multer');
const router = express.Router();
const Don = require('../models/Don');
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

router.get('/archives',verifyToken, donController.getArchivedDons);
router.get('/categorie/:categorie', donController.getDonsByCategorie);

router.get('/', donController.getDons);
router.get('/:id', donController.getDonById);
router.put('/:id', verifyToken, upload.single('url_image'), donController.updateDon);
router.delete('/:id', verifyToken, donController.deleteDon);

router.post('/:id/prendre', verifyToken, donController.prendreDon);
router.put('/:id/archives', verifyToken, donController.archiveDon);
router.put('/:id/desarchiver', verifyToken, donController.unarchiveDon);


// GET /api/dons/reserves/:userId
router.get("/reserves/:userId", async (req, res) => {
  try {
    const donsReserves = await Don.find({
      statut: "reserve",
      preneur: req.params.userId
    }).populate("user").populate("preneur");

    res.status(200).json(donsReserves);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// PUT /api/dons/reserver/:id
router.put("/reserver/:id", async (req, res) => {
  try {
    const don = await Don.findById(req.params.id);
    if (!don) {
      return res.status(404).json({ message: "Don introuvable" });
    }

    don.statut = "reserve"; // 👈 Change le statut ici
    don.preneur = req.body.preneur || null; // facultatif : enregistrer le preneur
    await don.save();

    res.status(200).json({ message: "Don réservé avec succès", don });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});





module.exports = router;
