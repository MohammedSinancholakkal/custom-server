const mongoose = require('mongoose')


const homeBannerSchema = new mongoose.Schema({

    bannerImage:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const HomeBanner = mongoose.model("HomeBanner",homeBannerSchema)
module.exports = HomeBanner