const Message = require('../models/Message');
const mongoose = require('mongoose');

// ✅ Créer un nouveau message
const createMessage = async (req, res) => {
  const { contenu, don_id, envoye_par, recu_par } = req.body;

  if (!contenu || !don_id || !envoye_par || !recu_par) {
    return res.status(400).json({ message: 'Champs requis manquants' });
  }

  try {
    const newMessage = await Message.create({
      contenu,
      don_id,
      envoye_par,
      recu_par,
      envoye_le: new Date(),
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('❌ Erreur lors de la création du message :', error.message);
    res.status(500).json({
      message: "Erreur lors de l'enregistrement du message",
      error: error.message
    });
  }
};

// ✅ Récupérer les messages entre deux utilisateurs pour un don donné
const getMessagesByDonAndUsers = async (req, res) => {
  const { donId, user1, user2 } = req.params;

  if (!donId || !user1 || !user2) {
    return res.status(400).json({ message: 'Paramètres manquants : donId, user1 ou user2' });
  }

  if (!mongoose.Types.ObjectId.isValid(donId)) {
    return res.status(400).json({ message: 'donId invalide' });
  }

  try {
    const messages = await Message.find({
      don_id: objectId,
      $or: [
        { envoye_par: user1, recu_par: user2 },
        { envoye_par: user2, recu_par: user1 }
      ]
    }).sort({ envoye_le: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ Erreur dans getMessagesByDonAndUsers :", error.message);
    res.status(500).json({
      message: "Erreur lors de la récupération des messages",
      error: error.message
    });
  }
};

module.exports = {
  getMessagesByDonAndUsers,
  createMessage,
};
