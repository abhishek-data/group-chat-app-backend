const Sequelize = require("sequelize");
const sequelize = require("../utils/database")

const Chat = sequelize.define("Chat", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    message_text: {
        type: Sequelize.STRING,
        allowNull: false
    }
})


module.exports = Chat