const Chat = require('../models/chat')
const User = require('../models/user')
const { uploadToS3 } = require('../services/S3services')


exports.addChat = async (req, res) => {
    try {
        const { text, name, groupId } = req.body
        const chat = await Chat.create({ message_text: text, name: name, GroupId: groupId, UserId: req.user.id })
        return res.status(201).json({ sucess: true, message: "message sent.", chat })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

exports.getChats = async (req, res, next) => {
    try {
        const chats = await Chat.findAll({ where: { groupId: req.params.groupId } })
        return res.status(200).json({ chats })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error." })
    }
}

// exports.uploadFile = async (req, res, next) => {
//     try {
//         const { name, groupId } = req.body
//         const file = req.file;
//         console.log({ file, name, groupId });
//         const filename = `${name}-${new Date()}.png`
//         const fileUrl = await uploadToS3(file, filename)
//         chat = await Chat.create({ message_text: fileUrl, groupId, name })
//         res.status(201).json({ message: "File uploaded successfully.", chat })
//     } catch (error) {
//         console.log("error", error);
//         return res.status(500).json({ error: "Internal Server Error." })
//     }
// }

exports.uploadFile = async (req, res) => {
    try {
        console.log(req.file)
        const { name, groupId } = req.body
        // const filename = `user-${req.user.id}/${req.file.filename}_${new Date()}.png`;
        const filename = req.file.originalname
        const fileURL = await uploadToS3(req.file.path, filename);
        const chat = await Chat.create({ message_text: fileURL, groupId, name })
        res.status(201).json({ message: "File uploaded successfully.", chat })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}