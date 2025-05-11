const express = require("express");
const router = express.Router(); // ✅ LIGNE MANQUANTE

const verifyToken = require("../middlewares/authMiddleware");
const Notification = require("../models/Notification");

// Exemple de route
router.get('/notifications', verifyToken, async (req, res) => {
  try {
    const notifs = await Notification.find({ destinataire: req.user._id })
      .sort({ createdAt: -1 })
      .populate('emetteur', 'pseudo')
      .populate('don', 'titre');

    res.status(200).json(notifs);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

module.exports = router;
