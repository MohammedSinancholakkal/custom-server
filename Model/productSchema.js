const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

   productName:{
        type:String,
        required:true
    },
    productPrice:{
        type:Number,
        required:true
    },
    offerPrice:{
        type:Number,
        required:true
    },
    productCategory:{
        type:String,
        required:true
    },  
    productImage:{
        type:String,
        required:true
    },
    isHome: {
        type: Boolean,
        default: false 
      },

},{ timestamps: true })  

const products = mongoose.model('products',productSchema)
module.exports = products