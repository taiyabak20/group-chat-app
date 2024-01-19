const messages = require('../models/messages');
const users = require('../models/users');
const Group = require('../models/group')
const {Op}= require('sequelize')
exports.addMessage =async (req, res)=>{
    try
    {
    const groupId = req.params.groupId
    const messageText = req.body.message;
    console.log(messageText)
    const group = await Group.findByPk(groupId);

    if (!group) {
        return res.status(404).json({ success: false, error: 'Group not found' });
    }

    const message = await group.createMessage({ message: messageText, userId: req.user.id });

    return res.json({ success: true, message });
}
catch(err){
    console.log(err)
    return res.status(500).json({success : false , msg : "Internal server error"})}
}

exports.getMessages =async (req,res)=>{
    try{
        const id = req.params.id;
        const groupId = req.body.groupId;
        //console.log(groupId)
        const data = await messages.findAll({where:{
            id: {
                [Op.gt]:id,
            },
             groupId: groupId,
        }, attributes : ['message'],
    include: [
        {
            model: users,
            attributes: ['name'],
        }
    ]})
        //console.log(data)
        return res.json(data)
    }
    catch(err){
        console.log(err)
    }
}