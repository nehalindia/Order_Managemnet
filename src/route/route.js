const express = require('express')
const router = express.Router()

const { authenticate}  = require('../middleware/auth')
const {createUser,userLogin,getUser,updateUser} = require('../controller/userController')
const {placeOrder} = require('../controller/orderController')

router.post('/signup',createUser)
router.post('/login', userLogin)
router.get('/user/:userId',authenticate, getUser)
router.post('/user/:userId',authenticate, updateUser)

router.post('/order/:userId',authenticate, placeOrder)

module.exports = router