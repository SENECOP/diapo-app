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
router.post('/', verifyToken, upload.array('url_image', 5), donController.createDon);

router.get('/archives',verifyToken, donController.getArchivedDons);
router.get('/categorie/:categorie', donController.getDonsByCategorie);
router.get("/reserves", verifyToken, async (req, res) => {
  try {
    const donsReserves = await Don.find({
      statut: "reserve",
      preneur: req.user._id
    }).populate("user").populate("preneur");

    res.status(200).json(donsReserves);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});


router.get('/mes-dons', verifyToken, async (req, res) => {
  try {
    const dons = await Don.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(dons);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});


router.get('/', donController.getDons);


router.put("/:id/reserver", verifyToken, donController.reserverDon);
router.put('/:id/archives', verifyToken, donController.archiveDon);
router.put('/:id/desarchiver', verifyToken, donController.unarchiveDon);
router.post('/:id/prendre', verifyToken, donController.prendreDon);
router.put('/:id', verifyToken, upload.single('url_image'), donController.updateDon);
router.delete('/:id', verifyToken, donController.deleteDon);

 
router.get('/:id', donController.getDonById);





// GET /api/dons/reserves/:userId











module.exports = router;
