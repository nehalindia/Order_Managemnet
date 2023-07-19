const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const route = require('./route/route')

app.use(express.json())
app.use(express.urlencoded({extended : true}))

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true})
.then(
    console.log("database connected")
)
.catch( err => console.log(err.message))

app.use('/', route)

app.listen(process.env.PORT, ()=>{
    console.log(`Our server is running on ${process.env.PORT}`)
})