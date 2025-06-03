const Conversation = require('../models/conversation');

// ➤ Créer une conversation si elle n'existe pas
const createOrGetConversation = async (req, res) => {
  const { don_id, utilisateur_1, utilisateur_2 } = req.body;

  if (!don_id || !utilisateur_1 || !utilisateur_2) {
    return res.status(400).json({ message: 'Champs requis manquants' });
  }

  try {
    // Chercher s’il existe déjà une conversation
    let conversation = await Conversation.findOne({
      don_id,
      $or: [
        { utilisateur_1, utilisateur_2 },
        { utilisateur_1: utilisateur_2, utilisateur_2: utilisateur_1 }
      ]
    });

    // Sinon, on la crée
    if (!conversation) {
      conversation = await Conversation.create({ don_id, utilisateur_1, utilisateur_2 });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création ou récupération de la conversation', error });
  }
};

module.exports = {
  createOrGetConversation,
};
