const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fname : { type: String, required : true},
    lname : { type: String, required : true},
    mobile : { type : Number, required: true, unique: true},
    email : { type : String, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, required: true, unique: true},
    password : { type: String, required: true, minLen: 8, maxLen :15},
    category : { type: String, required : true, default : "regular"},
    address : { type: String},
    city : { type : String}
}, { timestamps : true})
module.exports = mongoose.model('user', userSchema)