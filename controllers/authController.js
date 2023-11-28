const User = require("../models/user")
const bcrypt = require("bcrypt")


exports.signup = async (req, res, next) => {
    try{
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
    }catch(err){
        res.status(500).json({error: "Internal Server Error"})
    }    
}

