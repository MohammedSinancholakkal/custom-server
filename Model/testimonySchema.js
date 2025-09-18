
const mongoose = require('mongoose')


const TestimonySchema = new mongoose.Schema({

    testimonyUserName:{
        type:String,
        required:true
    },
    vehicleName:{
        type:String,
        required:true,
    },
    testimonyMessage:{
        type:String,
        required:true
    },
    testimonyImage:{
        type:String,
        required:true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
    status:{
        type:String,
        required:true,
        default:"pending"
    },
},{timestamps:true})

const testimonials = mongoose.model("testimonials",TestimonySchema)
module.exports = testimonials