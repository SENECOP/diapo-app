const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    console.log("Récupération des notifications pour l'utilisateur:", req.user._id);
    // Récupérer les notifications du destinataire (utilisateur connecté)
    const notifications = await Notification.find({ destinataire: req.user._id })
      .populate("emetteur", "pseudo avatar") 
      .populate("don", "titre") 
      .sort({ createdAt: -1 });
      
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications :", error);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
};

module.exports = {
  getNotifications,
};
