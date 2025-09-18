const users = require("../Model/userSchema");




// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.userId; // comes from auth middleware (decoded JWT)
    const { productId, quantity } = req.body;

    const user = await users.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // check if product already exists in cart
    const existingItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      // update quantity
      existingItem.quantity += quantity || 1;
    } else {
      // add new item
      user.cart.push({ productId, quantity: quantity || 1 });
    }

    await user.save();

    res.status(200).json({ message: "Product added to cart", cart: user.cart });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ error: err.message });
  }
};








// Get Cart

exports.getCart = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await users.findById(userId).populate("cart.productId").sort({ createdAt: -1 });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ cart: user.cart });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ error: err.message });
  }
};





// Remove Item from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;

    const user = await users.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    await user.save();

    res.status(200).json({ message: "Item removed from cart", cart: user.cart });
  } catch (err) {
    console.error("Error removing from cart:", err);
    res.status(500).json({ error: err.message });
  }
};




// Update Quantity

exports.updateCartQuantity = async (req, res) => {
    try {
      const userId = req.userId;
      const { productId, quantity } = req.body;
  
      const user = await users.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const item = user.cart.find((c) => c.productId.toString() === productId);
      if (!item) return res.status(404).json({ message: "Product not in cart" });
  
      item.quantity = quantity;
      await user.save();
  
      res.status(200).json({ message: "Quantity updated", cart: user.cart });
    } catch (err) {
      console.error("Error updating quantity:", err);
      res.status(500).json({ error: err.message });
    }
  };
  
  




// Empty Cart

exports.emptyCart = async (req, res) => {
    try {
        const userId = req.userId; // ✅ consistent with other cart controllers
  
      const user = await users.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.cart = []; // clear all cart items
      await user.save();
  
      res.status(200).json({ message: "Cart emptied successfully", cart: [] });
    } catch (err) {
      console.error("Empty cart error:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  