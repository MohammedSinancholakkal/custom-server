const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  billingUserName: {
    type: String,
    required: true,
    trim: true, 
  },
  billingVehicleName: {
    type: String,
    required: true,
    trim: true, 
  },
  billingVehicleNumber: {
    type: String,
    required: true,
    trim: true,
  },
  billingPhoneNumber: {
    type: Number,
    required: true,
   
  },

  products: [
    {
      productName: { type: String, required: true, trim: true },
      qty: { type: Number, required: true, min: 1 },
      price: { type: Number },
      offerPrice: { type: Number }, // optional if discount applied
      total: { type: Number, required: true },
    },
  ],

  labourCharges: {
    type: Number,
    default: 0,
  },

  grandTotal: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now, 
  },
});

const Billing = mongoose.model("Billing", billingSchema);
module.exports = Billing;
