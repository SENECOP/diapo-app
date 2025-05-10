const Notification = require('../models/Notification');

// ➕ Créer une notification
const createNotification = async (req, res) => {
  try {
    const { emetteur, destinataire, message, don } = req.body;

    if (!emetteur || !destinataire || !message) {
      return res.status(400).json({ error: "Champs obligatoires manquants" });
    }

    const notification = new Notification({
      emetteur,
      destinataire,
      message,
      don: don || null 
    });

    await notification.save();

    res.status(201).json({ message: "Notification créée", notification });
  } catch (error) {
    console.error("Erreur lors de la création de la notification :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


// 🔽 Obtenir toutes les notifications
const getNotifications = async (req, res) => {
    
  try {
    const notifications = await Notification.find().populate('don destinataire');
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ✅ Marquer comme lue
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(id, { lu: true }, { new: true });

    if (!notification) {
      return res.status(404).json({ error: "Notification non trouvée" });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

module.exports = {
  createNotification,
  getNotifications,

}