const express = require('express');
const router = express.Router();
const conversationApi = require('../controllers/conversationApi');
const verifyToken = require('../middlewares/authMiddleware');

// Créer ou récupérer une conversation
router.post('/', verifyToken, conversationApi.createOrGetConversation);

// Récupérer une conversation spécifique
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('participants', 'pseudo ville_residence')
      .populate('don', 'titre description url_image')
      .populate('messages');

    if (!conversation) {
      return res.status(404).json({ message: "Conversation non trouvée" });
    }

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.params.userId
    })
    .populate("participants", "pseudo email")
    .populate("lastMessage")
    .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (err) {
    console.error("Erreur:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;

module.exports = router;