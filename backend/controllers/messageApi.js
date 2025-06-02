const Message = require('../models/Message');
const mongoose = require('mongoose');
const Don = require('../models/Don');
const User = require('../models/User'); // Assure-toi que ce modèle est bien défini

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

// Récupérer les messages entre deux utilisateurs pour un don
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

// Récupérer la liste des conversations d'un utilisateur (par pseudo)
const getConversationsByPseudo = async (req, res) => {
  const pseudo = req.params.pseudo;

  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { envoye_par: pseudo },
            { recu_par: pseudo },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$envoye_par", pseudo] },
              "$recu_par",
              "$envoye_par"
            ],
          },
          lastMessage: { $first: "$$ROOT" }
        }
      },
      {
        $project: {
          interlocuteur: "$_id",
          lastMessage: 1,
        }
      }
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({ error: "Erreur lors du chargement des conversations." });
  }
};

const getUnreadMessagesCount = (req, res) => {
  res.status(200).json({ count: 0 });
};

module.exports = {
  getMessagesByDonAndUsers,
  createMessage,
  getConversationsByPseudo,
  getUnreadMessagesCount,
};
