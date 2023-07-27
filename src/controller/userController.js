const {isValid, isValidRequestBody} = require('../validation/validator')
const userModel = require('../model/userModel')
const validator = require('validator');
require('dotenv').config
const bcrypt= require("bcrypt")
const jwt= require("jsonwebtoken")
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId



const createUser = async (req,res) => {
    try{
        if(!isValidRequestBody(req.body)){
           return res.status(400).send({status : false, message : "Add some data"})
        }

        let {fname,lname,mobile,email,password,address,city} = req.body

        // console.log(req.body)

        req.body.mobile = mobile = mobile.trim()
        req.body.email = email = email.trim()
        password = password.trim()

        if(!isValid(fname) || !isValid(lname) || !isValid(mobile) || !isValid(email) || !isValid(password)){
            return res.status(400).send({status : false, message : "add valid data in field"})
        }

        if(!validator.isEmail(email)){
            return res.status(400).send({status : false, message : "Enter valid email id"})
        }

        if(!validator.isMobilePhone(mobile)){
            return res.status(400).send({status : false, message : "Enter valid mobile number"})
        }

        if(password.length < 8 || password.length > 15){
            return res.status(400).send({status : false, message : "Password length must be between 8 to 15"})
        }

        let salt = await bcrypt.genSalt(5)
        req.body.password = await bcrypt.hash(password,salt)

        if(address && !isValid(address)){
            return res.status(400).send({status: false, message : "must add valid value"})
        }
        if(city && !isValid(city)){
            return res.status(400).send({status: false, message : "must add valid value"})
        }
        
        let mobileExist =  await userModel.findOne({mobile : mobile})
        if(mobileExist){
            return res.status(400).send({status : false, message : "Mobile number already exist"})
        }

        let emailExist =  await userModel.findOne({email : email})
        if(emailExist){
            return res.status(400).send({status : false, message : "Email Id already exist"})
        }

        let data = await userModel.create(req.body)
        res.status(201).send({status : true, message : "user created", Data: data})
    }catch(error){
        res.status(500).send({status : false, message : error.message})
    }
}

const userLogin = async (req,res) => {
    try{
        if(!isValidRequestBody(req.body)){
            return res.status(400).send({status: false, message : "Add data in body"})
        }
        
        let {email, password} = req.body
        if( !isValid(email) || !isValid(password) ){
            return res.status(400).send({status : false, message : "Must add email and pass"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).send({status : false, message : "Enter valid email id"})
        }

        let user = await userModel.findOne({email : email})
        if(!user){
            return res.status(401).send({status : false, message : " User not exist"})
        }

        let match = await bcrypt.compareSync(password, user.password)
        if(!match){
            return res.status(401).send({status : false, message : "Not valid user"})
        }

        const token = jwt.sign({userId : user._id},process.env.JWT_SECRET_KEY, {expiresIn : "30d"}, {iat : Date.now()})
        res.status(200).send({
            status : true,
            message: "user login successful", 
            data : {
              userId: user._id,
              token: token
              } 
          })
    }catch(error){
        res.status(500).send({status : false, message : error.message})
    }
}
const getUser = async (req,res) =>{
    try{
        let {userId} = req.params
        if(!req.params){
            return res.status(400).send({status: false, message: "add userId "})
        }
        if(!ObjectId.isValid(userId)){
            return res.status(400).send({status: false, message: "not valid id"})
        }
        let user = await userModel.findById(userId)
        if(!user){
            return res.status(404).send({ status: false, message : "user not found"})
        }
        if(req.userId != userId){
            return res.status(403).send({ status: false, message : "user not authorize"})
        }

        let offer = ""
        if(user.Order < 10){
            offer =`If you place ${10-user.Order} more order you will become Gold! User`
        }
        else if(user.Order < 20){
            offer =`If you place ${20-user.Order} more order you will become platinum! User`
        }
        // else if(user.Order < 30){
        //     offer =`If you place ${30-user.Order} more order you will become Gold! User`
        // }
        res.status(200).send({status : true, message: offer, data: user})
    }catch(error){
        return res.status(500).send({ status: false, message: error.message})
    }
}

const updateUser = async (req,res) =>{
    try{
        if(!isValidRequestBody(req.body)){
            return res.status(400).send({status: false, message : "Add data in body"})
        }
        
        let {userId} = req.params
        if(!req.params){
            return res.status(400).send({status: false, message: "add userId "})
        }
        if(!ObjectId.isValid(userId)){
            return res.status(400).send({status: false, message: "not valid id"})
        }
        let user = await userModel.findById(userId)
        if(!user){
            return res.status(404).send({ status: false, message : "user not found"})
        }
        if(req.userId != userId){
            return res.status(403).send({ status: false, message : "user not authorize"})
        }

        let {fname,lname,email,mobile,password,address,city} = req.body
        if(fname){
            if(!isValid(fname)){
                return res.status(400).send({status : false, message : "add valid name"})
            }
            user.fname = fname
        }

        if(lname){
            if(!isValid(lname)){
                return res.status(400).send({status : false, message : "add valid name"})
            }
            user.lname = lname
        }

        if(email){
            if(!isValid(email) && !validator.isEmail(email)){
                return res.status(400).send({status : false, message : "add valid email"})
            }
            user.email = email
        }

        if(mobile){
            if(!isValid(mobile) && !validator.isMobilePhone(mobile)){
                return res.status(400).send({status : false, message : "add valid Mobile"})
            }
            user.mobile = mobile
        }

        if(address){
            if(!isValid(address)){
                return res.status(400).send({status : false, message : "Add valid address"})
            }
            user.address = address
        }

        if(city){
            if(!isValid(city)){
                return res.status(400).send({status : false, message : "Add valid city"})
            }
            user.city = city
        }

        if(password){
            if(!isValid(password)){
                return res.status(400).send({status : false, message : "Add valid password"})
            }
            if(password.length < 8 || password.length > 15){
                return res.status(400).send({status : false, message : "password length must be between 8 to 15"})
            }
            let salt = await bcrypt.genSalt(5)
            user.password = await bcrypt.hash(password, salt)
        }

        let data = await user.save()
        
        res.status(200).send({status:true, message: "Profile Updated Sucessfully", Data: data})

    }catch(error){
        return res.status(500).send({ status: false, message: error.message})
    }
}

module.exports = {
    createUser,
    userLogin,
    getUser,
    updateUser
}