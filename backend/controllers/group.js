const group = require('../models/group');
const members = require('../models/members');
const users = require('../models/users')
const Sequelize = require('sequelize');
exports.createGroup = async(req, res)=>{
    const name = req.body.name
    const selectedUsers = req.body.member;
    const user = req.user.id;
    const newGroup =await group.create({name: name})
    const usersToBeAdded = await users.findAll({where: {
        id:{ [Sequelize.Op.or]: [selectedUsers, user],}
    }})
    //console.log(usersToBeAdded)
    const addedUser = await newGroup.addUser(usersToBeAdded)
    const member = await req.user.addGroup(newGroup , {through : {admin : true , creator : true}})


    return res.json({addedUser,user, newGroup})
    
}

exports.getGroups =async (req, res)=>{
    const id = req.user.id;
    const result = await members.findAll({where: {
        userId: id
    },
    include: [{
        model: group,
        attributes: ['name'], 
      }],})
    return res.json(result)
}