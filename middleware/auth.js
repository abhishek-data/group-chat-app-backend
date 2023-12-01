const jwt = require('jsonwebtoken');
const User = require('../models/user')

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('authorization')
        const userId = jwt.verify(token, process.env.JWT_SECRET_KEY).userId
        const user = await User.findByPk(userId)
        if (!user) {
            return res.status(404).json({ error: "User Not Found" })
        }
        req.user = user
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })
    }
}

module.exports = { authenticate }