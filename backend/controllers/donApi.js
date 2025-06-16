const Don = require('../models/Don');
const Message = require('../models/message');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Conversation = require('../models/conversation');



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
      donateur: userId,
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
// Dans donApi.js
const getDonById = async (req, res) => {
  try {
    const don = await Don.findById(req.params.id)
      .populate({
        path: 'donateur',
        select: '_id pseudo email' // Sélectionnez explicitement les champs nécessaires
      })
      .lean(); // Convertit en objet JavaScript simple

    if (!don) {
      return res.status(404).json({ message: "Don non trouvé" });
    }

    // Vérification de la présence du donateur
    if (!don.donateur) {
      console.error("Don sans donateur:", don._id);
      return res.status(500).json({ message: "Erreur: Donateur manquant" });
    }

    res.json(don);
  } catch (err) {
    console.error("Erreur getDonById:", err);
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

    if (don.donateur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    don.titre = req.body.titre || don.titre;
    don.description = req.body.description || don.description;
    don.ville_don = req.body.ville_don || don.ville_don;

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
  try {
    const don = await Don.findById(req.params.id);
    if (!don) {
      return res.status(404).json({ message: 'Don non trouvé' });
    }

    if (don.donateur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    await don.deleteOne(); // ou don.remove() selon ta version de Mongoose
    res.json({ message: 'Don supprimé avec succès' });
  } catch (error) {
    console.error('Erreur dans deleteDon :', error);
    res.status(500).json({ message: error.message });
  }
};


// Archiver / désarchiver un don
const archiveDon = async (req, res) => {
  try {
    const don = await Don.findById(req.params.id);
    if (!don) {
      return res.status(404).json({ message: 'Don non trouvé' });
    }

    if (don.donateur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    don.archived = true;
    await don.save();

    res.json({ message: 'Don archivé avec succès', don });
  } catch (error) {
    console.error('Erreur dans archiveDon :', error);
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

    const dons = await Don.find({ donateur: userId, archived: true }); // correction ici
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

    const don = await Don.findById(req.params.id).populate("donateur");
    if (!don) return res.status(404).json({ message: "Don non trouvé" });

    if (don.preneur && don.preneur.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Vous avez déjà réservé ce don." });
    }

    // Ajouter l'utilisateur aux intéressés
    if (!don.interesses.includes(req.user._id)) {
      don.interesses.push(req.user._id);
    }

    don.preneur = req.user._id;
    don.statut = "reserve";
    await don.save();

    // ✅ Notification au donateur
    await Notification.create({
      destinataire: don.donateur._id,
      emetteur: req.user._id,
      message: `${req.user.pseudo} est intéressé(e) par votre don "${don.titre}".`,
      don: don._id,
      vu: false,
    });

    // ✅ Vérifier s'il existe déjà une conversation entre les deux
    let conversation = await Conversation.findOne({
      participants: { $all: [don.donateur._id, req.user._id] },
    });

    // ✅ Si aucune, la créer
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [don.donateur._id, req.user._id],
      });
    }

    // ✅ Créer le message initial dans la conversation
   
      const newMessage = await Message.create({
        conversation: conversation._id,
        sender: req.user._id,
        text: `Bonjour, je suis intéressé(e) par votre don "${don.titre}".`,
        createdAt: new Date(),
      });

      // ✅ Mettre à jour la conversation (si tu stockes les messages dedans)
      if (!conversation.messages) conversation.messages = [];

      conversation.messages.push(newMessage._id);
      conversation.updatedAt = new Date(); // utile pour trier les conversations
      await conversation.save();


    res.status(200).json({
      message: "Don réservé avec succès. Notification envoyée. Conversation démarrée.",
      don,
    });
    io.to(don.donateur._id.toString()).emit("newNotification", {
  message: `${req.user.pseudo} est intéressé(e) par votre don "${don.titre}".`,
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
    const dons = await Don.find({ donateur: userId, archived: false }).sort({ createdAt: -1 });

    res.status(200).json(dons);
  } catch (error) {
    console.error("Erreur lors de la récupération des dons du donateur :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

const marquerCommeVu = async (req, res) => {
  const { donId } = req.params;
  const userId = req.user._id; 
  try {
    const don = await Don.findById(donId);
    if (!don) return res.status(404).json({ message: "Don non trouvé" });

    if (!don.vusPar.includes(userId)) {
      don.vusPar.push(userId);
      await don.save();
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Erreur marquage comme vu :", err);
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
};

const takeDon = async (req, res) => {
  const { id } = req.params;
  const { pris_par } = req.body;

  if (!pris_par) {
    return res.status(400).json({ message: "Le pseudo du preneur est requis." });
  }

  try {
    // 1. Mettre à jour le don
    const don = await Don.findById(id);
    if (!don) return res.status(404).json({ message: "Don non trouvé." });

    if (don.pris_par) {
      return res.status(400).json({ message: "Ce don est déjà réservé." });
    }

    don.pris_par = pris_par;
    don.etat = "réservé"; // si tu gères un champ `etat`
    await don.save();

    // 2. Créer un message automatique
    const newMessage = new Message({
      contenu: `Bonjour, je suis intéressé(e) par votre don : "${don.description}"`,
      don_id: don._id,
      envoye_par: pris_par,
      recu_par: don.donateur,
      image: don.image_url || "",
      description: don.description,
    });

    await newMessage.save();

    // 3. Éventuellement, émettre le message via socket.io
    req.io?.emit("receiveMessage", newMessage); // facultatif

    res.status(200).json({ message: "Don réservé et message envoyé.", don, newMessage });
  } catch (err) {
    console.error("Erreur takeDon:", err);
    res.status(500).json({ message: "Erreur serveur." });
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
  marquerCommeVu,
  takeDon,
};

