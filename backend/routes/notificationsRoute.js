const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { markAsRead } = require('../controllers/notificationApi');


//  Créer une notification
router.post('/', async (req, res) => {
    console.log("Reçu depuis le frontend :", req.body);

  try {
    const { emetteur, destinataire, message, don } = req.body;

    const nouvelleNotif = new Notification({
      emetteur,
      destinataire,
      message,
      don
    });

    await nouvelleNotif.save();
    res.status(201).json(nouvelleNotif);
  } catch (error) {
    console.error("Erreur POST /api/notifications :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
  
});

//  Obtenir les notifications d’un utilisateur
router.get('/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ destinataire: req.params.userId })
      .populate('emetteur', 'pseudo') // ajuster selon ton modèle User
      .populate('don', 'titre')
      .sort({ date: -1 });

    res.json(notifications);
  } catch (error) {
    console.error('Erreur récupération notifications :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Marquer une notification comme lue
router.put('/:id/lire', markAsRead, async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(req.params.id, { lu: true }, { new: true });
    res.json(notif);
  } catch (error) {
    console.error('Erreur mise à jour notification :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
