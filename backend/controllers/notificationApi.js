const Notification = require('../models/Notification');

// ➕ Créer une notification
exports.createNotification = async (req, res) => {
  try {
    const { message, don, destinataire } = req.body;

    // Validation rapide
    if (!message || !don || !destinataire) {
      return res.status(400).json({ error: "Champs requis manquants (message, don, destinataire)" });
    }

    const notification = new Notification({
      message,
      don,
      destinataire,
      lu: false
    })

    const savedNotification = await notification.save();

    res.status(201).json(savedNotification);
  } catch (error) {
    console.error("Erreur lors de la création de la notification :", error.message);
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
};

// 🔽 Obtenir toutes les notifications
exports.getNotifications = async (req, res) => {
    
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
