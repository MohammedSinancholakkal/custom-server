const mongoose = require('mongoose')

const quoteSchema = new mongoose.Schema({

    quoteName:{
        type:String,
        required:true
    },
    quoteEmail:{
        type:String,
        required:true
    },
    quoteBikeModel:{
        type:String,
        required:true
    },
    quoteMessage:{
        type:String,
        required:true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "rejected"],
        default: "pending"
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    requestedAt: {
        type: Date,
        default: Date.now
      }
},{timestamps:true})

const Quote = mongoose.model('Quote',quoteSchema)
module.exports = Quote

