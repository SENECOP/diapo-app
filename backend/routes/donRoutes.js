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
router.get('/', donController.getDons);
router.get('/:id', donController.getDonById);
router.put('/:id', verifyToken, upload.single('url_image'), donController.updateDon);
router.delete('/:id', verifyToken, donController.deleteDon);

router.post('/:id/prendre', verifyToken, donController.prendreDon);
router.put('/:id/archives', verifyToken, donController.archiveDon);
router.put('/:id/desarchiver', verifyToken, donController.unarchiveDon);


router.get('dons/archives',verifyToken, donController.getArchivedDons);
router.get('/categorie/:categorie', donController.getDonsByCategorie);




module.exports = router;
