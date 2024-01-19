const user = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize');
const members = require('../models/members');
const group = require('../models/group');
require('dotenv').config()


exports.createUser = async(req, res)=>{
    const {name, email, pnumber, password} = req.body;
    try{
        const userExist = await user.findOne({
            where : {email: email}
        })
    
        if(userExist){
            return res.status(400).json('error')
        }
        else{
            const saltrounds = 10;
            bcrypt.hash(password, saltrounds, async(err, hash)=>{
                await user.create({
                    name: name,
                    email: email,
                    phoneNumber: pnumber,
                    password: hash
                })
                console.log(user)
                return res.status(201).json(user);
            })
       }
    }
    catch(err){
        console.log(err)
    }
}

exports.loginUser = async(req, res)=>{
    const  {password, email} = req.body;
    const result = await user.findOne({where : {email : email}})
    //console.log(result)
    if(result){
        let passwordMatch =await bcrypt.compare(password, result.password)
        //console.log(result.password, password, passwordMatch)
        if(passwordMatch){
            const token = jwt.sign({id: result.id}, process.env.TOKEN_SECRET)
            res.status(200).json(token)
        }
        else{
            return res.status(401).json('incorrect password')
        }
    }
    else{
        return res.status(404).json('user not found')
    }
}

exports.groupMembers= async(req, res)=>{
    const groupId = req.params.groupId
console.log(groupId)
    try {
        const you = req.user.id
        //console.log(req.user)
        const users = await user.findAll({
           
            attributes: ['name', 'id'],
            include: [
              {
                model: members,
                where: { groupId: groupId },
                attributes: ['admin', 'creator'], 
                include: [
                  {
                    model: group,
                    attributes: ['id', 'name'], 
                  },
                ],
              },
            ],
          });
          
        
        if(users){
            res.json({users , you})
        }
}
catch(err){
    console.log(err)
}
}

exports.getAll =async (req, res)=>{
    const result = await user.findAll( {where: {
        id: {
          [Op.ne]: req.user.id,
        }}})
    return res.json(result)
}