const user = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.createUser = async(req, res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const pnumber = req.body.pnumber;
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
                    pnumber: pnumber,
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