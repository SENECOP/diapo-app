const express = require('express');
const router = express.Router();
const conversationApi = require('../controllers/conversationApi');
const verifyToken = require('../middlewares/authMiddleware');

// ➤ Créer ou récupérer une conversation
router.get('/', verifyToken, (req, res) => {
  res.json({ message: 'Route conversations OK' });
});

router.post('/', verifyToken, conversationApi.createOrGetConversation);

router.get("/conversation", verifyToken, async (req, res) => {
  const { don_id, utilisateur1, utilisateur2 } = req.query;
  try {
    const conversation = await conversation.findOne({
      don_id,
      $or: [
        { utilisateur_1: utilisateur1, utilisateur_2: utilisateur2 },
        { utilisateur_1: utilisateur2, utilisateur_2: utilisateur1 }
      ]
    });
    if (!conversation) return res.status(404).json({ message: "Conversation non trouvée" });
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
