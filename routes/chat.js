const express = require('express');
const { authenticate } = require('../middleware/auth');
const chatController = require('../controllers/chatController');
const multer = require('multer')
const upload = multer({dest:'uploads/'})

const router = express.Router();

router.post('/chat',authenticate, chatController.addChat);

router.get('/chat', authenticate, chatController.getChats)

router.post('/upload-file', authenticate,upload.single('image'), chatController.uploadFile)



module.exports = router;