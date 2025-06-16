// controllers/conversationController.js
const Conversation = require('../models/conversation');
const Message = require('../models/Message');

exports.createOrGetConversation = async (req, res) => {
  try {
    const { don_id, participant1, participant2 } = req.body;

    // Validation
    if (!don_id || !participant1 || !participant2) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    // Vérifier si une conversation existe déjà
    let conversation = await Conversation.findOne({
      don: don_id,
      participants: { $all: [participant1, participant2] }
    })
    .populate('participants', 'pseudo email')
    .populate('don', 'titre description');

    // Si aucune conversation existe, en créer une nouvelle
    if (!conversation) {
      conversation = new Conversation({
        participants: [participant1, participant2],
        don: don_id
      });

      // Créer un message initial
      const initialMessage = new Message({
        conversation: conversation._id,
        sender: participant2, // Le preneur
        content: `Bonjour, je suis intéressé par votre don`,
        don: don_id
      });

      await initialMessage.save();
      conversation.messages.push(initialMessage._id);
      conversation.lastMessage = initialMessage._id;
      await conversation.save();

      // Peupler à nouveau pour avoir toutes les données
      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'pseudo email')
        .populate('don', 'titre description')
        .populate('lastMessage');
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error("Erreur création conversation:", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};