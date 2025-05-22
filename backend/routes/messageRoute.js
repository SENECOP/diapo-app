const express = require('express');
const router = express.Router();
const { getMessagesByDonAndUsers } = require('../controllers/messageApi');

// GET /api/messages/:donId/:user1/:user2
router.get('/:donId/:user1/:user2', getMessagesByDonAndUsers);

module.exports = router;
