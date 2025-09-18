const mongoose = require('mongoose')


const productBannerSchema = new mongoose.Schema({

    productBanner:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const ProductBanner = mongoose.model("ProductBanner",productBannerSchema)
module.exports = ProductBanner