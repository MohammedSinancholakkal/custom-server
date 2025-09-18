const mongoose = require('mongoose')


const serviceBannerSchema = new mongoose.Schema({

    serviceBanner:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const ServiceBanner = mongoose.model("ServiceBanner",serviceBannerSchema)
module.exports = ServiceBanner