const sequelize = require('../utils/db')
const Sequelize = require('sequelize')

const members = sequelize.define('members', {
    id:{
        type : Sequelize.INTEGER,
        autoIncrement : true,
        primaryKey :true,
        allowNull:false
    },
    admin:{
        type : Sequelize.BOOLEAN,
        defaultValue : false
    },
    creator:{
        type : Sequelize.BOOLEAN,
        defaultValue : false
    }
})

module.exports = members;