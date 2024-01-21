const sequelize = require('../utils/db')
const Sequelize = require('sequelize')

const messages = sequelize.define('message', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey : true,
        allowNull : false,
        autoIncrement : true,
    },
    message: {
        type: Sequelize.STRING(1000),
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false,
        default: 'text'
    }
})

module.exports = messages;