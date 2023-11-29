const express = require('express');
const { authenticate } = require('../middleware/auth');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.post('/chat',authenticate, chatController.addChat);

router.get('/chat', authenticate, chatController.getChats)



module.exports = router;