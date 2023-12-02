const Sequelize = require("sequelize");
const sequelize = require("../utils/database")


const ArchiveChat = sequelize.define("ArchiveChat", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    message_text: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type:Sequelize.STRING,
        allowNull: false
    }
})




module.exports = ArchiveChat