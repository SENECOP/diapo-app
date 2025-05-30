const Message = require('../models/Message');
const mongoose = require('mongoose');


// Créer un nouveau message
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
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement du message', error });
  }
};

const getMessagesByDonAndUsers = async (req, res) => {
  const { donId, user1, user2 } = req.params;
  try {
    const messages = await Message.find({
      don_id: donId,
      $or: [
        { envoye_par: user1, recu_par: user2 },
        { envoye_par: user2, recu_par: user1 }
      ]
    }).sort({ createdAt: 1 });
    
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const getConversationsByPseudo = async (req, res) => {
  const { pseudo } = req.params;

  try {
    // Étape 1: Récupérer toutes les conversations impliquant l'utilisateur
    const messages = await Message.find({
      $or: [{ envoye_par: pseudo }, { recu_par: pseudo }]
    }).sort({ envoye_le: -1 });

    // Étape 2: Grouper par don et par interlocuteur
    const conversationsMap = new Map();

    messages.forEach(msg => {
      const key = `${msg.don_id}_${msg.envoye_par === pseudo ? msg.recu_par : msg.envoye_par}`;
      
      if (!conversationsMap.has(key)) {
        conversationsMap.set(key, {
          don_id: msg.don_id,
          interlocuteur: msg.envoye_par === pseudo ? msg.recu_par : msg.envoye_par,
          dernierMessage: msg.contenu,
          messageInitial: msg,
          createdAt: msg.envoye_le
        });
      }
    });

    // Étape 3: Convertir en tableau et trier
    const conversations = Array.from(conversationsMap.values())
      .sort((a, b) => b.createdAt - a.createdAt);

    res.json(conversations);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const getUnreadMessagesCount = async (req, res) => {
  try {
    const pseudo = req.user.pseudo;

    const unreadCount = await Message.countDocuments({
      recu_par: pseudo,
      lu: false,
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error("Erreur fetch messages non lus :", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};



module.exports = {
  getMessagesByDonAndUsers,
  createMessage,
  getConversationsByPseudo,
  getUnreadMessagesCount,
};
