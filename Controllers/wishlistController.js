const users = require('../Model/userSchema')
const products = require('../Model/productSchema')




exports.addToWishlist = async(req,res)=>{
    console.log("inside addToWishlist function");

    try{

        const { productId } = req.params;
        const userId = req.userId; // from JWT middleware

        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
          }
           // check if product exists
        const product = await products.findById(productId);
        if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
        }
         // add to wishlist without duplicates
    const user = await users.findByIdAndUpdate(
        userId,
        { $addToSet: { wishlist: productId } },
        { new: true }
      ).populate("wishlist");
  
      res.status(200).json({ success: true, wishlist: user.wishlist });

    }catch(err){
        res.status(406).json(err)
    }
    
}




// Get user wishlist

exports.getWishlist = async (req, res) => {
    try {
      const userId = req.userId;
  
      const user = await users.findById(userId).populate("wishlist").sort({ createdAt: -1 });
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({ success: true, wishlist: user.wishlist });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error fetching wishlist", error: err.message });
    }
  };



// ✅ Remove product from wishlist

exports.removeFromWishlist = async (req, res) => {

    try {
      const { productId } = req.params;
      const userId = req.userId;
  
      const user = await users.findByIdAndUpdate(
        userId,
        { $pull: { wishlist: productId } },
        { new: true }
      ).populate("wishlist");
  
      res.status(200).json({ success: true, wishlist: user.wishlist });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error removing from wishlist", error: err.message });
    }
    
  };
  