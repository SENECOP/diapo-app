const express = require('express');
const router = express.Router();
const { getMessagesByDonAndUsers, createMessage, getUnreadMessagesCount, getConversationsByPseudo, markMessagesAsRead } = require('../controllers/messageApi');
const verifyToken = require('../middlewares/authMiddleware');
const Conversation = require('../models/conversation');


// GET /api/messages/:donId/:user1/:user2
router.get("/conversations/:pseudo", getConversationsByPseudo);

router.get("/unread", verifyToken, getUnreadMessagesCount);
router.patch("/messages/read/:donId/:user1/:user2", markMessagesAsRead);

router.get('/:userId', async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.params.userId,
    }).populate('participants', 'pseudo'); // optionnel : pour afficher les pseudos
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:donId/:user1/:user2', getMessagesByDonAndUsers);
router.post('/', createMessage);


module.exports = router;
