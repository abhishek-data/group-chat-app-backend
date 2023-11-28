const Sequelize = require("sequelize");
const sequelize = require("../utils/database")

const User = sequelize.define("User", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    fullname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ispremiumuser: {
        type: Sequelize.BOOLEAN,

    },
    totalExpenses: {
        type: Sequelize.INTEGER,
    }
})


module.exports = User