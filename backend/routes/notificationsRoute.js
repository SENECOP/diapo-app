const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { createNotification } = require("../controllers/notificationApi");


// Récupérer les notifications d’un utilisateur
router.get("/user/:userId", async (req, res) => {
  try {
    const notifs = await Notification.find({ destinataire: req.params.userId })
      .populate("don", "titre") // optionnel
      .sort({ date: -1 });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/", createNotification);



// Marquer les notifications comme lues
router.put("/mark-as-read/:userId", async (req, res) => {
  try {
    await Notification.updateMany({ destinataire: req.params.userId }, { vu: true });
    res.json({ message: "Notifications marquées comme lues" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
