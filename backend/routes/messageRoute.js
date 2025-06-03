const express = require('express');
const router = express.Router();
const { getMessagesByDonAndUsers, createMessage, getUnreadMessagesCount, getConversationsByPseudo, markMessagesAsRead } = require('../controllers/messageApi');
const verifyToken = require('../middlewares/authMiddleware');


// GET /api/messages/:donId/:user1/:user2
router.get("/conversations/:pseudo", getConversationsByPseudo);

router.get("/unread", verifyToken, getUnreadMessagesCount);
router.patch("/messages/read/:donId/:user1/:user2", markMessagesAsRead);



router.get('/:donId/:user1/:user2', getMessagesByDonAndUsers);
router.post('/', createMessage);


module.exports = router;
