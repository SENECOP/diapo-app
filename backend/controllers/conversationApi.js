const Conversation = require('../models/conversation');

// ➤ Créer une conversation si elle n'existe pas
const createOrGetConversation = async (req, res) => {
   console.log("REQ BODY =>", req.body);
  console.log("USER FROM TOKEN =>", req.user);
  const { don_id, utilisateur_1, utilisateur_2 } = req.body;

  if (!don_id || !utilisateur_1 || !utilisateur_2) {
    return res.status(400).json({ message: 'Champs requis manquants' });
  }

  try {
    const conversation = await Conversation.findOne({
      don_id,
      $or: [
        { utilisateur_1, utilisateur_2 },
        { utilisateur_1: utilisateur_2, utilisateur_2: utilisateur_1 },
      ],
    }) || await Conversation.create({ don_id, utilisateur_1, utilisateur_2 });

    res.status(200).json(conversation);
  } catch (error) {
    console.error("Erreur backend:", error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Exemple route GET /conversation



module.exports = {
  createOrGetConversation,
  
};
