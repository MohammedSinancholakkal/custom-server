const products = require('../Model/productSchema')





// Add Product Controller (Admin only)
exports.AddProduct = async (req, res) => {
  console.log("inside addProduct function");

  const { productName, productPrice, offerPrice, productCategory } = req.body;
  const productImage = req.file ? req.file.filename : null; 

  try {
    const existingProduct = await products.findOne({ productName });
    if (existingProduct) {
      return res.status(409).json({ success: false, message: "Product already exists" });
    }

    const newProduct = new products({
      productName,
      productPrice,
      offerPrice,
      productCategory,
      productImage
    });

    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
};





// PUT //adding products to home

exports.addProductToHome = async (req, res) => {
  try {
    const { id } = req.params;

    const HomeProductCount = await products.countDocuments({isHome: true}).sort({ createdAt: -1 });

    if(HomeProductCount > 4){
      return res.status(400).json("Maximum Products Reached");
    }


    const updatedProduct = await products.findByIdAndUpdate(
      id,
      { isHome: true },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json("Product not found");
    }
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





// GET products from home

exports.getHomeProducts = async (req, res) => {
  try {
    const homeProducts = await products.find({ isHome: true }).limit(4) // ✅ only where isHome=true
    res.status(200).json(homeProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};









// Get All Products
exports.GetAllProducts = async (req, res) => {
  console.log("inside GetAllProducts function");

  const searchKey = req.query.search

  const query = {

    productName:{$regex:searchKey,$options:"i"}
  }

  try {
    const allProducts = await products.find(query).sort({ createdAt: -1 });
    res.status(200).json(allProducts)
  } catch (err) {
    res.status(401).json(err)
  }
}




// Get Home Display Products

exports.GetHomeDisplayProducts = async (req, res) => {
  console.log("inside GetHomeDisplayProducts function");
  const searchKey = req.query.search

  const query = {
    productName:{$regex:searchKey,$options:'i'}
  }

  try {
    const homeDisplayProducts = await products.find(query)
    res.status(200).json(homeDisplayProducts)
  } catch (err) {
    res.status(401).json(err)
  }
}







// Edit Product
exports.EditProducts = async (req, res) => {
  const { productName, productPrice, offerPrice, productCategory, productImage } = req.body
  const uploadImage = req.file ? req.file.filename : productImage
  const { pid } = req.params

  try {
    const updatedProduct = await products.findByIdAndUpdate(
      pid,
      { productName, productPrice, offerPrice, productCategory, productImage: uploadImage },
      { new: true }
    )
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product: updatedProduct });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
}





// Delete Product
exports.DeleteProduct = async (req, res) => {
  console.log("inside deleteProduct function");

  const { pid } = req.params

  try {
    const deletedProduct = await products.findByIdAndDelete(pid)

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json(deletedProduct)

  } catch (err) {
    res.status(406).json(err)
  }
}





// controller function
exports.removeFromHome = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedProduct = await products.findByIdAndUpdate(
      id,
      { isHome: false },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json("Product not found");
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
};


  


