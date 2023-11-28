const Chat = require('../models/chat')


exports.addChat = async (req, res) => {
    try {
        const { text } = req.body
        const chat = await Chat.create({ message_text: text, UserId: req.user.id })
        return res.status(201).json({ chat })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}