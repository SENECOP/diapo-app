const Don = require('../models/Don');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Créer un don
const createDon = async (req, res) => {
  try {
    const { titre, description, categorie, ville_don } = req.body;
    const userId = req.user?._id;

    // Gérer plusieurs images
    const imagePaths = req.files?.map(file =>
      `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    ) || [];

    const newDon = new Don({
      titre,
      description,
      categorie: categorie?.toLowerCase(),
      ville_don,
      url_image: imagePaths, // tableau d'URLs
      archived: false,
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
  const { categorie, userId } = req.query;

  try {
    let filter = {archived: false};
    if (categorie) {
      filter.categorie = { $regex: new RegExp(`^${categorie}$`, 'i') };
    }
    if (userId) {
      filter.user = userId;  
    }

    const dons = await Don.find(filter).sort({ createdAt: -1 });
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
  if (don.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Accès non autorisé" });
  }

  try {
    const don = await Don.findById(req.params.id);
    if (!don) {
      return res.status(404).json({ message: 'Don non trouvé' });
    }

    don.titre = req.body.titre || don.titre;
    don.description = req.body.description || don.description;
    don.ville_don = req.body.ville_don || don.ville_don;

    // Si une nouvelle image est envoyée
    if (req.files && req.files.length > 0) {
      don.url_image = req.files.map(file =>
        `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
      );
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
  if (don.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Accès non autorisé" });
  }

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
    if (don.user.toString() !== req.user._id.toString()) {
     return res.status(403).json({ message: "Accès non autorisé" });
    }

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

// Récupérer tous les dons archivés
const getArchivedDons = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const dons = await Don.find({ user: userId, archived: true }); // correction ici
    if (!dons || dons.length === 0) {
      return res.status(404).json({ message: 'Aucun don archivé trouvé' });
    }

    res.json(dons);
  } catch (err) {
    console.error("Erreur dans getArchivedDons :", err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};




// Récupérer par catégorie, y compris les nouveautés
const getDonsByCategorie = async (req, res) => {
  try {
    const { categorie } = req.params;
    let dons;

    if (categorie.toLowerCase() === "nouveautes") {
      dons = await Don.find().sort({ createdAt: -1 }).limit(5);
    } else {
      dons = await Don.find({
        categorie: { $regex: new RegExp(categorie, "i") },
        archived: false
      }).sort({ createdAt: -1 });
    }

    res.json(dons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const reserverDon = async (req, res) => {
  try {
    console.log("Données reçues pour réservation :", req.body);

    const don = await Don.findById(req.params.id).populate("user");
    if (!don) return res.status(404).json({ message: "Don non trouvé" });

    if (don.preneur && don.preneur.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Vous avez déjà réservé ce don." });
    }

     // Ajouter l'utilisateur aux intéressés s'il n'y est pas déjà
    if (!don.interesses.includes(req.user._id)) {
      don.interesses.push(req.user._id);
    }

    don.preneur = req.user._id;
    don.statut = "reserve";
    await don.save();


    // ✅ Crée la notification et enregistre-la dans une variable
    const notification = await Notification.create({
      destinataire: don.user._id,
      emetteur: req.user._id,
      message: `${req.user.pseudo} est intéressé(e) par votre don "${don.titre}".`,
      don: don._id,
      vu: false,
    });

    res.status(200).json({
      message: "Don réservé avec succès. Notification envoyée au donateur.",
      don,
    });
  } catch (error) {
    console.error("Erreur dans reserverDon:", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


// Récupérer les dons du donateur connecté
const getDonsDuDonateur = async (req, res) => {
  try {
    const userId = req.user._id; // récupéré depuis le token JWT via le middleware `auth`
    const dons = await Don.find({ user: userId, archived: false }).sort({ createdAt: -1 });

    res.status(200).json(dons);
  } catch (error) {
    console.error("Erreur lors de la récupération des dons du donateur :", error);
    res.status(500).json({ message: "Erreur serveur", error });
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
  getDonsByCategorie,
  getArchivedDons, 
  reserverDon,
  getDonsDuDonateur,
};

