const mongoose = require('mongoose')


const bookedServices = new mongoose.Schema({

    bookedName:{

        type:String,
        required:true
    },
    bookedEmail:{

        type:String,
        required:true
    },
    bookedPhoneNo:{

        type:Number,
        required:true
    },
    bookedMessage:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum: ["pending", "confirmed", "rejected"], // 👈 restrict values
        default:"pending"
    },
    bookedDate: {
        type: String, // or Date type if you want
        required: false
    },
    isConfirmed: {
        type: Boolean,
        default: false, 
      },
},{ timestamps: true })


const Booked = mongoose.model("Booked",bookedServices)
module.exports = Booked