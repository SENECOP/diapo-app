const Notification = require("../models/Notification");

const reserverDon = async (req, res) => {
  try {
    const don = await Don.findById(req.params.id).populate('user');

    if (!don) return res.status(404).json({ message: "Don non trouvé" });

    if (don.statut !== 'actif') {
      return res.status(400).json({ message: "Ce don n'est pas disponible" });
    }

    don.statut = 'reserve';
    don.preneur = req.user._id;
    await don.save();

    // Créer la notification pour le donateur
    await Notification.create({
      destinataire: don.user._id,
      emetteur: req.user._id,
      message: `${req.user.pseudo} a exprimé son intérêt pour votre don "${don.titre}".`,
      don: don._id
    });

    res.status(200).json({ message: "Don réservé et notification envoyée", don });
  } catch (error) {
    console.error("Erreur réservation ou notification :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


// Fonction pour récupérer les notifications d'un utilisateur
const getNotifications = async (req, res) => {
  try {
    // Récupérer les notifications du destinataire (utilisateur connecté)
    const notifications = await Notification.find({ destinataire: req.user._id }).sort({ createdAt: -1 });

    // Si aucune notification, retourner un tableau vide
    if (notifications.length === 0) {
      return res.status(200).json({ message: 'Aucune notification.', notifications: [] });
    }

    // Retourner les notifications
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications :", error);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
};

module.exports = {
  reserverDon,
  getNotifications,
};
