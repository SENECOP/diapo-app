const express = require('express');
const multer = require('multer');
const path = require('path');
const Don = require('../models/Don'); 
const router = express.Router();





const {
  createDon,
  getDons,
  updateDon,
  deleteDon
} = require('../controllers/donApi'); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });


 
router.post('/dons', upload.single('url_image'), (req, res) => {
  const don = {
    titre: req.body.titre,
    description: req.body.description,
    url_image: req.file.filename, // Le nom du fichier téléchargé
  };
  res.status(201).json(don); // Réponse avec les infos du don
});

// Route pour créer un don
router.post('/dons', upload.single('url_image'), createDon);


// Route pour récupérer tous les dons
router.get('/dons', getDons);

// Route pour récupérer un don par son ID
const getDonById = async (req, res) => {
  try {
    const don = await Don.findById(req.params.id).populate("User"); // 👈 on récupère le donneur ici
    if (!don) return res.status(404).json({ message: "Don non trouvé" });
    res.json(don);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

router.get('/dons/:id', async (req, res) => {
  console.log("Route d'accès au don", req.params.id);  // Ajoute un log pour vérifier l'ID
  try {
    const don = await Don.findById(req.params.id).populate("user");
    if (!don) return res.status(404).json({ message: "Don non trouvé" });
    res.json(don);
  } catch (err) {
    console.error("Erreur lors de la récupération du don:", err);  // Vérifie les erreurs du serveur
    res.status(500).json({ message: "Erreur serveur" });
  }
});



// Route pour modifier un don
router.put('/dons/:id', updateDon);

// Route pour supprimer un don
router.delete('/dons/:id', deleteDon);

router.get('/dons/categorie/:categorie', async (req, res) => {
  try {
    const { categorie } = req.params; // ✅ correct
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

