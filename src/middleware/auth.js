const jwt  = require('jsonwebtoken')
require('dotenv').config

const authenticate = (req,res, next) => {
    try{

        if(!req.headers.authorization) {return res.status(400).send({status: false, message: "Header is not present"})}
        
        let token = req.headers.authorization.split(" ")[1]
        if(!token) {
            return res.status(400).send({status: false, message: "Token is not present" })
        }
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err,decoded) =>{
            if(err){ return res.status(403).send({status : false, message : "not valid token author"})}
            else{
                req.userId = decoded.userId
                next()
            }
        })
    }catch(error){
        res.status(500).send({status : false, message: error.message})
    }
}


module.exports = {
    authenticate
}