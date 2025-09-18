
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"  // assuming your product model is named "Product"
        }
    ],
     // ✅ Cart
     cart: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",  // link to Product model
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]

}, { timestamps: true });



// from collection name users create a model to the database  with userSchema model
const users = mongoose.model('users',userSchema)
//export the collection name 
module.exports = users 