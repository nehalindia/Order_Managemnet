const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema({
    userId : { type: ObjectId, ref:'user', required : true },
    // items: [{
    //     productName: { type: String, required : true },
    //     quantity: { type: Number, required: true, min : 1 }
    // }],
    totalItem : { type : Number, required : true},
    quantity : { type : Number, required : true},
    price : { type: Number, required: true},
    discount : { type: Number, required : true, default : 0}
}, {timestamps : true})

module.exports = mongoose.model('order',orderSchema)