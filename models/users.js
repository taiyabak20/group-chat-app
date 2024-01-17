const sequelize = require('../utils/db')
const Sequelize = require('sequelize')

const user = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey : true,
        allowNull : false,
        autoIncrement : true,
        
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phoneNumber:{
        type: Sequelize.INTEGER,
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
})

module.exports = user;