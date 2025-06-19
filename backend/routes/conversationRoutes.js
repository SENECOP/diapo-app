const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const Conversation = require('../models/conversation');
const conversationApi = require('../controllers/conversationApi');

// Créer ou récupérer une conversation
router.post('/conversations', verifyToken, conversationApi.createOrGetConversation);

// Récupérer une conversation précise via query params
router.get('/conversation', verifyToken, async (req, res) => {
  const { don_id, utilisateur1, utilisateur2 } = req.query;
  try {
    const conversation = await Conversation.findOne({
      don_id,
      $or: [
        { utilisateur_1: utilisateur1, utilisateur_2: utilisateur2 },
        { utilisateur_1: utilisateur2, utilisateur_2: utilisateur1 },
      ],
    });
    if (!conversation) return res.status(404).json({ message: "Conversation non trouvée" });
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Récupérer toutes les conversations d’un utilisateur (par exemple pseudo)
router.get('/conversations/:pseudo', verifyToken, async (req, res) => {
  const pseudo = req.params.pseudo;
  try {
    const conversations = await Conversation.find({
      $or: [{ utilisateur_1: pseudo }, { utilisateur_2: pseudo }]
    })
    // ajoute un populate ici si tu as besoin
    .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
