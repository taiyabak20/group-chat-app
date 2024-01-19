const members = require('../models/members');

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