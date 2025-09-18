const Billing = require('../Model/billingDetailsSchema')
const products = require('../Model/productSchema')
const Order = require("../Model/paymentSchema");






// // Get All Products
exports.GetAllProductsToBilling = async (req, res) => {
    console.log("inside GetAllProductsToBilling function");
  
    const searchKey = req.query.search
  
    const query = {
  
      productName:{$regex:searchKey,$options:"i"}
    }
  
    try {
      const BillingProducts = await products.find(query).sort({ createdAt: -1 });
      res.status(200).json(BillingProducts)
    } catch (err) {
      res.status(401).json(err)
    }
  }




  
// delete orders for users

exports.deleteOrdersOfUsers = async(req,res)=>{
  console.log("inside deleteOrdersOfUsers function");

  const {id}=req.params
  try{
      const deleteOrders = await Order.findByIdAndDelete(id)
      res.status(200).json(deleteOrders)
  }catch(err){
      res.status(406).json(err)
  }
  
}






//   addBillingDetails

exports.addBillingDetails = async(req,res)=>{
    console.log("inside addBillingDetails function");

    const{billingUserName,billingVehicleName,billingVehicleNumber,billingPhoneNumber, products,labourCharges,grandTotal}=req.body

   try{
    const UserDetails = new Billing({
        billingUserName,billingVehicleName,billingVehicleNumber,billingPhoneNumber, products,labourCharges,grandTotal
    }) 
    await UserDetails.save()
    res.status(200).json(UserDetails)
   }catch(err){
    res.status(406).json(err)
   }

    
}


// get added billing details

exports.getAddedDetails = async (req, res) => {
  const searchVehicle = req.query.search || "";

  const query = searchVehicle
    ? {
        $or: [
          { billingVehicleNumber: { $regex: searchVehicle, $options: "i" } },
          { $expr: { $regexMatch: { input: { $toString: "$billingPhoneNumber" }, regex: searchVehicle } } }
        ]
      }
    : {};

  try {
    const getAddedBillings = await Billing.find(query).sort({ createdAt: -1 });
    res.status(200).json(getAddedBillings);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};




// delete added billing details

exports.deleteAddedBillings = async(req,res)=>{
    console.log("inside deleteAddedBillings function");

    const {id}=req.params
    try{
        const deleteBillings = await Billing.findByIdAndDelete(id)
        res.status(200).json(deleteBillings)
    }catch(err){
        res.status(406).json(err)
    }
    
}




// Update billing details
exports.updateBillingDetails = async (req, res) => {
    console.log("inside updateBillingDetails function");
  
    const { id } = req.params;
    const { billingUserName, billingVehicleName, billingVehicleNumber, billingPhoneNumber, products, labourCharges, grandTotal } = req.body;
  
    try {
      // Find and update the billing document
      const updatedBilling = await Billing.findByIdAndUpdate(
        id,
        { billingUserName, billingVehicleName, billingVehicleNumber, billingPhoneNumber, products, labourCharges, grandTotal },
        { new: true } // return the updated document
      );
  
      if (!updatedBilling) {
        return res.status(404).json({ message: "Billing not found" });
      }
  
      res.status(200).json(updatedBilling);
    } catch (err) {
      console.error(err);
      res.status(406).json(err);
    }
  };
  
  