const messages = require('../models/messages');
const users = require('../models/users');
const Group = require('../models/group')
const {Op}= require('sequelize')
const {uploadToS3} = require('../services/s3services')

exports.addMessage =async (req, res)=>{
    try
    {
    const groupId = req.params.groupId
    const messageText = req.body.message;
    const messageType = req.body.type || 'text'; 
    const group = await Group.findByPk(groupId);
    if (!group) {
        return res.status(404).json({ success: false, error: 'Group not found' });
    }

   const message = await group.createMessage({
     message: messageText,
      userId: req.user.id,
      type: messageType,
    });

    return res.json({ success: true, message });
}
catch(err){
    console.log(err)
    return res.status(500).json({success : false , msg : "Internal server error"})}
}

exports.getMessages =async (req,res)=>{
    try{
        const groupId = req.params.groupId;
        const data = await messages.findAll({where:{
           
             groupId: groupId,
        }, attributes : ['message', 'type'],
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

exports.uploadFile =async (req, res)=>{
    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);
    const fileName = new Date()+ req.file.originalname;
    const {mimetype, buffer} = req.file;
try{

        const data = await uploadToS3( buffer, fileName)
        const message = await group.createMessage({
        message: data,
         userId: req.user.id,
         type: mimetype,
       });
       return res.json(message)
}
catch(err){
    console.log(err)
    return res.status(500).json({ success: false, msg: "Internal server error" })
}

}