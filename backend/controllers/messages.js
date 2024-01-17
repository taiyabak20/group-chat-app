const messages = require('../models/messages');
const users = require('../models/users');
exports.addMessage = (req, res)=>{
    try
    {
    const message = req.body.message;
    const result = req.user.createMessage({message: message})
    return res.json({sucess: true, message : result})
}
catch(err){
    console.log(err)
    return res.status(500).json({success : false , msg : "Internal server error"})}
}

exports.getMessages =async (req,res)=>{
    try{
        const data = await messages.findAll({ attributes : ['message'],
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