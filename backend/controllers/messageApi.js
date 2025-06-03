const Message = require('../models/Message');
const mongoose = require('mongoose');

// ➤ Créer un nouveau message
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
      lu: false,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de l\'enregistrement du message',
      error,
    });
  }
};

// ➤ Récupérer les messages entre deux utilisateurs pour un don donné
const getMessagesByDonAndUsers = async (req, res) => {
  const { donId, user1, user2 } = req.params;

  try {
    const messages = await Message.find({
      don_id: donId,
      $or: [
        { envoye_par: user1, recu_par: user2 },
        { envoye_par: user2, recu_par: user1 },
      ],
    }).sort({ envoye_le: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➤ Récupérer toutes les conversations de l'utilisateur (groupées par don et interlocuteur)
const getConversationsByPseudo = async (req, res) => {
  const { pseudo } = req.params;

  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ envoye_par: pseudo }, { recu_par: pseudo }],
          don_id: { $ne: null },
          envoye_par: { $ne: null },
          recu_par: { $ne: null },
        },
      },
      {
        $sort: { envoye_le: -1 },
      },
      {
        $group: {
          _id: {
            don_id: "$don_id",
            autreUser: {
              $cond: [
                { $eq: ["$envoye_par", pseudo] },
                "$recu_par",
                "$envoye_par"
              ]
            }
          },
          lastMessage: { $first: "$$ROOT" }
        },
      },
      {
        $project: {
          interlocuteur: "$_id.autreUser",
          dernierMessage: "$lastMessage.contenu",
          messageInitial: {
            $cond: [
              { $ifNull: ["$lastMessage", false] },
              "$lastMessage",
              {
                don_id: "$_id.don_id",
                envoye_par: pseudo,
                recu_par: "$_id.autreUser",
                contenu: "",
                envoye_le: new Date(),
              }
            ]
          },
          nonLus: {
            $cond: [
              {
                $and: [
                  { $eq: ["$lastMessage.recu_par", pseudo] },
                  { $eq: ["$lastMessage.lu", false] }
                ]
              },
              true,
              false
            ]
          },
          _id: 0
        }
      },
      {
        $sort: { "messageInitial.envoye_le": -1 }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    console.error("Erreur lors de la récupération des conversations :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ➤ Marquer tous les messages comme lus entre user et un interlocuteur pour un don
const markMessagesAsRead = async (req, res) => {
  const { donId, user1, user2 } = req.params;

  try {
    await Message.updateMany(
      {
        don_id: donId,
        envoye_par: user2,
        recu_par: user1,
        lu: false,
      },
      { $set: { lu: true } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Erreur lors du marquage comme lus :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};



// ➤ Nombre de messages non lus pour un utilisateur
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

// ✅ Export des fonctions
module.exports = {
  createMessage,
  getMessagesByDonAndUsers,
  getConversationsByPseudo,
  markMessagesAsRead,
  getUnreadMessagesCount,
};
