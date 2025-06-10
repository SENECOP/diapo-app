const Conversation = require('../models/conversation');

// ➤ Créer une conversation si elle n'existe pas
const createOrGetConversation = async (req, res) => {
      console.log("Données reçues dans le body :", req.body); // 🔥 ce log est essentiel

  const { don_id, utilisateur_1, utilisateur_2 } = req.body;

  console.log("DON_ID:", don_id);
  console.log("UTILISATEUR_1:", utilisateur_1);
  console.log("UTILISATEUR_2:", utilisateur_2);

  if (!don_id || !utilisateur_1 || !utilisateur_2) {
    return res.status(400).json({ message: 'Champs requis manquants' });
  }

  try {
    // Chercher s’il existe déjà une conversation
   let conversation = await Conversation.findOne({
    don_id,
    $or: [
      { utilisateur_1: utilisateur_1, utilisateur_2: utilisateur_2 },
      { utilisateur_1: utilisateur_2, utilisateur_2: utilisateur_1 }
    ]
  });


    // Sinon, on la crée
    if (!conversation) {
      conversation = await Conversation.create({ don_id, utilisateur_1, utilisateur_2 });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
      }
};

module.exports = {
  createOrGetConversation,
};
