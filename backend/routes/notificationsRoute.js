const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { markAsRead } = require('../controllers/notificationApi');


//  Créer une notification
// POST /api/notifications
router.post('/', async (req, res) => {
    const { emetteur, destinataire, message, don } = req.body;
  
    try {
      const newNotif = new Notification({
        emetteur,
        destinataire,
        message,
        don,
        lu: false,
      });
  
      await newNotif.save();
      res.status(201).json(newNotif);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la création de la notification." });
    }
  });
  

//  Obtenir les notifications d’un utilisateur
router.get('/user/:id', async (req, res) => {
    try {
      const notifications = await Notification.find({ destinataire: req.params.id }).sort({ createdAt: -1 });
      res.json(notifications);
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la récupération des notifications' });
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
