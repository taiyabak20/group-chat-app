const { TokenExpiredError } = require('jsonwebtoken');
const members = require('../models/members');
const user = require('../models/users');
const { Op, literal } = require('sequelize');

exports.makeAdmin =async (req, res)=>{
    const userId = req.body.id;
    const groupId = req.body.groupId;
    console.log(userId, groupId)
 try{
    const result = await members.findOne({
    where: {
        userId: userId,
        groupId: groupId
    }
});
if(!result.admin){
   const admin = await result.update({admin: true})
   //console.log(admin)
   res.json({ success: true, message: 'User made admin successfully.' })
}
else{
    res.json({ success: false, message: 'User is already an admin.' })
}
//console.log(result.admin)
}
catch(err){
console.log(err)
}

}

exports.removeMember = async(req, res )=>{
    const userId = req.body.id;
    const groupId = req.body.groupId;
    try

    {
        const result = await members.destroy({ where: { groupId, userId } });
    res.status(200).json({ success: true, message: 'User removed from the group successfully' });

}
catch(err){
    console.log(err)
}
}


exports.notMembers = async (req, res) => {
    const groupId = req.params.groupId;

    try {
        console.log(groupId)
        const notMembers = await members.findAll({
            
            where:{
                userId:{       
                    [Op.notIn]: user.sequelize.literal(`(SELECT userId FROM members WHERE groupId = '${groupId}')`),                }
            },
            attributes: ['userId'],
        });
        const userIds = notMembers.map((member) => member.userId);
        console.log(userIds)
        const users = await user.findAll({
            where: {
                id: {
                    [Op.in]: userIds,
                },
            },
            attributes: ['id', 'name'], 
        });

console.log(users)
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.addToGroup = async(req, res)=>{
    const groupId = req.params.groupId;
    const membersToBeAdded = req.body.membersToBeAdded;

    console.log(groupId, membersToBeAdded)
    const result =  await members.create({
        userId: membersToBeAdded,
        groupId: groupId
    })
res.json('user added')
    console.log(result)
}

exports.joinGrp = async(req, res)=>{
    try {

        const groupId = req.body.value;
        const result = await members.create({
            userId: req.user.id,
            groupId: groupId
        })
        return res.json('joined group')
        
    }
    catch(err){
        console.log(err)
        return res.json('already a user')
    }
  
}