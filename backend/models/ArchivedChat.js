const sequelize = require('../utils/db')
const Sequelize = require('sequelize')

const archivedChats = sequelize.define('archivedChats',{
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        allowNull : false
    },
    message : {
        type : Sequelize.STRING,
        allowNull : false
    },
    type : {
        type : Sequelize.STRING,
        allowNull : false,
        defaultValue : "text"
    },
    groupId :{
        type : Sequelize.UUID,
        allowNull : false
    }, 
    userId : {
        type : Sequelize.INTEGER,
        allowNull : false
    }
})

module.exports = archivedChats;