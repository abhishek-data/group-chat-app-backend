const express = require('express');
const { authenticate } = require('../middleware/auth');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.post('/chat',authenticate, chatController.addChat);



module.exports = router;