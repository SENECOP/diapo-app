const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const Conversation = require('../models/conversation');
const Message = require('../models/Message');

// Récupérer les conversations d'un utilisateur
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.params.userId
    })
    .populate('participants', 'pseudo email')
    .populate('don', 'titre description url_image')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (err) {
    console.error("Erreur:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Récupérer les messages d'une conversation
router.get('/:conversationId', verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({
      conversation: req.params.conversationId
    })
    .populate('sender', 'pseudo')
    .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Envoyer un message
router.post('/', verifyToken, async (req, res) => {
  try {
    const { conversation, content, don } = req.body;
    const sender = req.user._id;

    const message = new Message({
      conversation,
      sender,
      content,
      don
    });

    await message.save();

    // Mettre à jour la conversation
    await Conversation.findByIdAndUpdate(conversation, {
      lastMessage: message._id,
      updatedAt: Date.now()
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;