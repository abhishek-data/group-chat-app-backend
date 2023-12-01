const { Op, where } = require("sequelize")
const Group = require("../models/group")
const UserGroup = require("../models/userGroup")
const Chat = require("../models/chat")
const User = require("../models/user")
const sequelize = require("../utils/database")

exports.createGroup = async (req, res, next) => {
    try {
        const { name, isAdmin } = req.body
        const group = await Group.create({ name })
        const groupUser = await UserGroup.create({ isAdmin, GroupId: group.id, UserId: req.user.id })
        res.status(201).json({ message: "Group created successfully", group })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })
    }

}

exports.getGroups = async (req, res, next) => {
    try {
        const groups = await req.user.getGroups({ attributes: ["id", "name"] })
        res.status(200).json({ groups })
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

exports.deleteGroup = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const adminCheck = await UserGroup.findOne({ where: { groupId, userid: req.user.id } });

        console.log(adminCheck);

        if (!adminCheck || !adminCheck.isAdmin) {
            return res.status(401).json({ error: "Unauthorized! You are not the admin of this group." });
        }

        await sequelize.transaction(async (t) => {
            await Chat.destroy({ where: { groupId }, transaction: t });
            await Group.destroy({ where: { id: groupId }, transaction: t });
        });

        res.status(200).json({ message: "Group deleted successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.getUsers = async (req, res, next) => {
    try {
        const groupId = req.params.groupId
        if (groupId) {
            const users = await UserGroup.findAll({ where: { groupId }, attributes: ["userid"] })
            const userIds = users.map(user => user.userid)
            const groupUsers = await User.findAll({ where: { id: { [Op.in]: userIds } }, include: [{ module: Group, where: { id: groupId } }], attributes: ["id", "fullname", "email"] })
            res.status(200).json({ groupUsers })
        } else {
            const users = await User.findAll({ attributes: ["id", "fullname", "email"], where: { id: { [Op.ne]: req.user.id } } })
            console.log(users);
            res.status(200).json({ users })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

exports.addUserToGroup = async (req, res, next) => {
    try {
        const groupId = req.params.groupId
        const { userId } = req.body
        const adminCheck = await UserGroup.findOne({ where: { GroupId: groupId, UserId: req.user.id } })
        if (!adminCheck.isAdmin) {
            return res.status(401).json({ error: "Unauthorized! you are not the admin of this group." })
        }
        const userGroup = await UserGroup.create({ GroupId: groupId, UserId: userId })
        res.status(201).json({ message: "User added successfully", userGroup })
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

exports.removeUserFromGroup = async (req, res, next) => {
    try {
        const { groupId, userId } = req.params
        const adminCheck = await UserGroup.findOne({ where: { groupId, userid: req.user.id } })
        if (!adminCheck.isAdmin) {
            return res.status(401).json({ error: "Unauthorized! you are not the admin of this group." })
        }
        await UserGroup.destroy({ where: { groupId, userid: userId } })
        res.status(200).json({ message: "User removed successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

exports.makeAdmin = async (req, res, next) => {
    try {
        const { userId, groupId } = req.body
        await UserGroup.update({ isAdmin: true }, { where: { groupId, userid: userId } })
        res.status(200).json({ message: "User is now admin" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}