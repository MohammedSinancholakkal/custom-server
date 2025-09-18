const HomeBanner = require('../Model/HomeBnnerSchema');
const ProductBanner = require('../Model/productBannerSchema');
const ServiceBanner = require('../Model/servicebannerSchema');


// addHomeBanner

exports.addHomeBanner = async(req,res)=>{
    console.log("inside homebanner function");

    if(!req.file){
        return res.status(400).json({ msg: "No file uploaded" });
    }

   try{
    const newBanner = new HomeBanner({
        bannerImage: req.file.filename, // store filename
    })
    await newBanner.save()
    res.status(200).json(newBanner)

   }catch(err){
    res.status(406).json(err)

   }
}






// getHomeBanner

exports.getHomeBanner = async(req,res)=>{
    console.log("inside get home banner function");

    try{
        const getBanner = await HomeBanner.find().limit(3)
    res.status(200).json(getBanner)

    }catch(err){
        res.status(406).json(err)
    }

    
}

// deleteBanner

exports.deleteHomebanner = async(req,res)=>{
    console.log("inside delete home banner function");

    const {id}=req.params
  try{
    const deleteBanner = await HomeBanner.findByIdAndDelete(id)
    res.status(200).json(deleteBanner)

  }catch(err){
    res.status(406).json(err)
  }
    

}



// getHomeBannertoHome

exports.getBannerToHome = async(req,res)=>{
    console.log("inside get banner to home function");

    try{
        const getbannerHome =  await HomeBanner.find()
        res.status(200).json(getbannerHome)

    }catch(err){
        res.status(406).json(err)
    }
    
}





// =======product banner section ===============//


// addProductBanner

exports.addProductBanner= async(req,res)=>{
    console.log("inide add product banner function");

    if(!req.file){
        return res.status(400).json({ msg: "No file uploaded" });
    }
   try{
    const addProductBanner = await ProductBanner({
        productBanner: req.file.filename, // store filename
    })
    await addProductBanner.save()
    res.status(200).json(addProductBanner)

   }catch(err){
    res.status(406).json(err)
   } 
}



// getProductBanner

exports.getProductBanner = async(req,res)=>{
    console.log("inside get product banner function");

    try{
        const productbanner = await ProductBanner.find().limit(3)
        res.status(200).json(productbanner)


    }catch(err){
        res.status(406).json(err)
    }
    
}



// deleteProductBanner

exports.deleteProductBanner = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await ProductBanner.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({ message: "Banner not found" });
      }
  
      res.status(200).json({ message: "Banner deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting banner", error: err.message });
    }
  };
  


// getProductBannerToProducts
exports.getProductBannerToProducts = async(req,res)=>{
    console.log("inside getProductBannerToProducts function");

   try {
    const getToProducts  = await ProductBanner.find()
    res.status(200).json(getToProducts)
   } catch (err) {
    res.status(406).json(err)
    
   }   
}




// =======service banner section ===============//

// addServiceBanner

exports.addServiceBanner = async(req,res)=>{
    console.log("inside add servise banner fucntion");

    if(!req.file){
        return res.status(400).json({ msg: "No file uploaded" });
    }
   try{
    const addProductBanner = await ServiceBanner({
        serviceBanner: req.file.filename, // store filename
    })
    await addProductBanner.save()
    res.status(200).json(addProductBanner)

   }catch(err){
    res.status(406).json(err)
   }  
    
}



// getServiceBanner

exports.getServiceBanner = async(req,res)=>{
    console.log("inside get service banner function");

    try{
        const productbanner = await ServiceBanner.find().limit(3)
        res.status(200).json(productbanner)


    }catch(err){
        res.status(406).json(err)
    }
    
}



// deleteServiceBanner

exports.deleteServiceBanner = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await ServiceBanner.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({ message: "Banner not found" });
      }
  
      res.status(200).json({ message: "Banner deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting banner", error: err.message });
    }
  };


  // getServiceBannertoServices

exports.getServiceBannertoServices = async(req,res)=>{
    console.log("inside getServiceBannertoServices function");

   try {
    const getToProducts  = await ServiceBanner.find()
    res.status(200).json(getToProducts)
   } catch (err) {
    res.status(406).json(err)
    
   }   
}