const Message = require('../models/Message');
const mongoose = require('mongoose');
const Don = require('../models/Don');

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

// Récupérer la liste des conversations d'un utilisateur
const getConversationsByUserId = async (req, res) => {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "ID utilisateur invalide." });
  }

  console.log("userId reçu par le backend:", req.params.userId);

  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(userId) },
            { receiverId: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", new mongoose.Types.ObjectId(userId)] },
              "$receiverId",
              "$senderId",
            ],
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },
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
  getConversationsByUserId,
  getUnreadMessagesCount,
};
