const express = require("express");
const router = express.Router(); 
const notificationApi = require('../controllers/notificationApi');


const verifyToken = require("../middlewares/authMiddleware");
const Notification = require("../models/Notification");


router.get('/', verifyToken, notificationApi.getNotifications);



module.exports = router;
