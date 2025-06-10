const express = require('express');
const router = express.Router();
const conversationApi = require('../controllers/conversationApi');
const verifyToken = require('../middlewares/authMiddleware');

// ➤ Créer ou récupérer une conversation
router.post('/', verifyToken, conversationApi.createOrGetConversation);

module.exports = router;
