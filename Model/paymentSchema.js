const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String, required: true },

    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "users",  // <-- reference your users collection
      required: true 
    },
    

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products', // matches the model name
          required: true,
        },
        
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        total: { type: Number, required: true },
        productImage: { type: String, required: true },
      },
    ],

    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
  