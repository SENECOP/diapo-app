const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

router.post('/', async (req, res) => {
  try {
    const { destinataire, emetteur, message, don } = req.body;
    const notification = new Notification({ destinataire, emetteur, message, don });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la notification' });
  }
});

module.exports = router;
