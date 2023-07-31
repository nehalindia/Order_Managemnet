const userModel = require('../model/userModel')
const orderModel = require('../model/orderModel')
const {isValid,isValidRequestBody} = require('../validation/validator')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const placeOrder = async (req,res) => {
    try{
        if(!isValidRequestBody(req.body)){
            return res.status(400).send({status: false, message: "add data in body"})
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

        let {totalItem, quantity, price} = req.body

        if(!isValid(totalItem) || !isValid(quantity) || !isValid(price)){
            return res.status(400).send({status : false, message : "Add valid data in field!"})
        }

        if(user.category == "gold"){ req.body.discount = 10 }
        else if(user.category == "platinum"){ req.body.discount = 20 }
        req.body.userId = userId

        let data = await orderModel.create(req.body)
        user.Order += 1
        
        if(user.Order > 9 && user.category == "regular" ){
            user.category = "gold"
        }
        else if(user.Order > 19 && user.category == "gold"){
            user.category = "platinum"
        }

        await user.save()

        res.status(201).send({status: true, order : data, user: user})
    }catch(error){
        return res.status(500).send({status : false, message : error.message})
    }
}

module.exports = {
    placeOrder,

}