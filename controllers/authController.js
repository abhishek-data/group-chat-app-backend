const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')


exports.signup = async (req, res, next) => {
    try {
        const { fullname, email, password, phone } = req.body
        const emailMatch = await User.findOne({ where: { email: email } })
        if (emailMatch) {
            return res.status(400).json({ "message": "Email already exists" })
        }
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({ "message": "Internal Server Error" })
            }
            const user = await User.create({
                fullname,
                email,
                password: hash,
                phone
            })
            if (user) {
                return res.status(201).json({ "message": "You have sucessfully signedup" })
            }
        })
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" })
    }
}

const generateAcessToken = (id, email, fullname) => {
    return jwt.sign({ userId: id, email: email, name: fullname }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
}


exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email: email } })
        if (!user) {
            return res.status(400).json({ "message": "Email does not exist" })
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ "message": "Internal Server Error" })
            }
            if (result) {
                const token = generateAcessToken(user.id, email, user.fullname)
                return res.status(200).json({ "message": "You have sucessfully logged in", token })
            }
            return res.status(401).json({ "message": "You have entered a wrong password" })
        })
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" })
    }
}



