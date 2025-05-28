const express = require('express');
const router = express.Router();
const { getMessagesByDonAndUsers, createMessage } = require('../controllers/messageApi');
const { getConversationsByPseudo } = require("../controllers/messageApi");


// GET /api/messages/:donId/:user1/:user2
router.get("/conversations/:pseudo", getConversationsByPseudo);

router.get('/:donId/:user1/:user2', getMessagesByDonAndUsers);
router.post('/', createMessage);


module.exports = router;
