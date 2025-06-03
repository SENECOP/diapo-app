const express = require('express');
const router = express.Router();
const conversationApi = require('../controllers/conversationApi');

// ➤ Créer ou récupérer une conversation
router.post('/', conversationApi.createOrGetConversation);

module.exports = router;
