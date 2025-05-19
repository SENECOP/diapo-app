const Notification = require("../models/Notification");


const createNotification = async (emetteurId, destinataireId, message, donId = null) => {
  try {
    const notification = new Notification({
      emetteur: emetteurId, // ID de l'émetteur
      destinataire: destinataireId, // ID du destinataire (donateur)
      message: message, // Le contenu du message
      don: donId, // L'ID du don associé (optionnel)
    });

    await notification.save();
    console.log("Notification créée avec succès");

  } catch (error) {
    console.error("Erreur lors de la création de la notification :", error);
  }
};


const getNotifications = async (req, res) => {
  try {
     if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }
    console.log("Récupération des notifications pour l'utilisateur:", req.user._id);
    // Récupérer les notifications du destinataire (utilisateur connecté)
    const notifications = await Notification.find({ destinataire: req.user._id })
      .populate("emetteur", "pseudo avatar") 
      .populate("don", "titre") 
      .sort({ createdAt: -1 });

    res.status(200).json({ notifications: notifications || [] });
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications :", error);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
};

const markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { vu: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification non trouvée" });
    }

    res.status(200).json({ message: "Notification marquée comme lue", notification });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la notification :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};
