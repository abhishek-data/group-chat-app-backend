const Chat = require('../models/chat')
const User = require('../models/user')


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

exports.getChats = async (req, res, next) => {
    try {
        const chats = await Chat.findAll({
            include: {
                model: User,
                attributes: ['id', 'fullname']
            },
        })
        return res.status(200).json({ chats })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error." })
    }
}