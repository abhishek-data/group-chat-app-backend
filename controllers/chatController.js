const Chat = require('../models/chat')
const User = require('../models/user')


exports.addChat = async (req, res) => {
    try {
        const { text, name, groupId } = req.body
        const chat = await Chat.create({ message_text: text, groupId: groupId, name: name })
        return res.status(201).json({ sucess:true, message:"message sent.", chat })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

exports.getChats = async (req, res, next) => {
    try {
        const chats = await Chat.findAll({where:{groupId:req.params.groupId}})
        return res.status(200).json({ chats })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error." })
    }
}

exports.uploadFile = async (req, res, next) => {
    try{
        const {file, name, groupId} = req.body
        const filename = `${name}-${new Date()}.png`
        const fileUrl = await uploadToS3(file, filename)
        chat = await Chat.create({message_text: fileUrl, groupId, name})
        res.status(201).json({message: "File uploaded successfully.", chat})
    }catch(error){
        return res.status(500).json({ error: "Internal Server Error." })
    }
}