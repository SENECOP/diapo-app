const Don = require('../models/Don');
const Notification = require('../models/Notification');

// Créer un don
const createDon = async (req, res) => {
  console.log("Utilisateur connecté :", req.user); 
  try {
    const { titre, description, categorie, ville_don } = req.body;
    const imagePath = req.file ? `${req.file.filename}` : null;
    const userId = req.user?._id;

    const newDon = new Don({
      titre,
      description,
      categorie: categorie?.toLowerCase(),
      ville_don,
      url_image: imagePath,
      user: userId,
    });

    await newDon.save();
    res.status(201).json({ message: 'Don créé avec succès', don: newDon });
  } catch (error) {
    console.error('Erreur lors de la création du don:', error);
    res.status(500).json({ message: error.message });
  }
};

// Obtenir tous les dons (filtrés ou non)
const getDons = async (req, res) => {
  const { categorie } = req.query;
  try {
    let dons;
    if (categorie) {
      dons = await Don.find({
        categorie: { $regex: new RegExp(`^${categorie}$`, 'i') },
      }).sort({ createdAt: -1 });
    } else {
      dons = await Don.find().sort({ createdAt: -1 });
    }
    res.status(200).json(dons);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Obtenir un don par ID
const getDonById = async (req, res) => {
  try {
    const don = await Don.findById(req.params.id).populate("user", "pseudo ville_residence email");

    console.log("Détails du don avec donneur peuplé : ", don); 
    if (!don) return res.status(404).json({ message: "Don non trouvé" });
    
    res.json(don);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Modifier un don
const updateDon = async (req, res) => {
  try {
    const don = await Don.findById(req.params.id);
    if (!don) {
      return res.status(404).json({ message: 'Don non trouvé' });
    }

    don.titre = req.body.titre || don.titre;
    don.description = req.body.description || don.description;
    don.ville_don = req.body.ville_don || don.ville_don;

    // Si une nouvelle image est envoyée
    if (req.file) {
      don.url_image = `${req.protocol}://${req.get('host')}/${req.file.filename}`; // ou ${req.protocol}://${req.get('host')}/uploads/${req.file.filename}
    }

    await don.save();
    res.json({ message: 'Don modifié avec succès', don });
  } catch (error) {
    console.error('Erreur dans updateDon :', error);
    res.status(500).json({ message: error.message });
  }
}; 

// Supprimer un don
const deleteDon = async (req, res) => {
  try {
    const don = await Don.findByIdAndDelete(req.params.id);
    if (!don) return res.status(404).json({ message: 'Don non trouvé' });
    res.status(200).json({ message: 'Don supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Archiver / désarchiver un don
const archiveDon = async (req, res) => {
  try {
    const don = await Don.findById(req.params.id);
    if (!don) return res.status(404).json({ message: "Don non trouvé" });

    don.archived = true;
    await don.save();
    res.status(200).json({ message: "Don archivé avec succès", don });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unarchiveDon = async (req, res) => {
  try {
    const don = await Don.findById(req.params.id);
    if (!don) return res.status(404).json({ message: "Don non trouvé" });

    don.archived = false;
    await don.save();
    res.status(200).json({ message: "Don désarchivé avec succès", don });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Prendre un don
const prendreDon = async (req, res) => {
  try {
    const don = await Don.findById(req.params.id);
    if (!don) return res.status(404).json({ message: "Don non trouvé" });

    if (don.preneur) {
      return res.status(400).json({ message: "Ce don a déjà été pris" });
    }

    don.preneur = req.user._id;
    await don.save();

    const notification = new Notification({
      destinataire: don.user,
      message: `${req.user.pseudo} souhaite prendre votre don "${don.titre}".`
    });

    await notification.save();

    res.status(200).json({ message: "Don pris avec succès, notification envoyée." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les dons archivés
const getArchivedDons = async (req, res) => {
  try {
    const dons = await Don.find({ archived: true });
    res.status(200).json(dons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer par catégorie
const getDonsByCategorie = async (req, res) => {
  try {
    const { categorie } = req.params;
    let dons;

    if (categorie) {
      dons = await Don.find({
        categorie: { $regex: new RegExp(`${categorie}$`, 'i') } // insensitive case
      }).sort({ createdAt: -1 });
    } else {
      dons = await Don.find().sort({ createdAt: -1 });
    }

    res.status(200).json(dons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createDon,
  getDons,
  getDonById,
  updateDon,
  deleteDon,
  archiveDon,
  unarchiveDon,
  prendreDon,
  getArchivedDons,
  getDonsByCategorie
};
