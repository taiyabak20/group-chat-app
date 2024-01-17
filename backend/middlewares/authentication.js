const jwt = require('jsonwebtoken')
const users = require('../models/users')
require('dotenv').config()

const auth = async(req, res, next)=>{
    try{
        const token = req.header.auth;
        if(!token){
            return res.status(401);
        }
        const verified = await jwt.verify(token, process.env.TOKEN_SECRET)
        const user = await users.findByPk(verified.userId)
        req.user = user;
        next()
    }
    catch(err){
        console.log(err)
        return res.status(500).json({success : false , msg : "Internal server error"})
    }
}

module.exports = auth;