
const testimonials = require('../Model/testimonySchema')

//add testimonials

exports.AddTestimonials = async (req,res)=>{
    console.log("inside addtestimonials function");

    const{testimonyUserName,vehicleName,testimonyMessage,rating} = req.body
    const testimonyImage = req.file ? req.file.filename : null; 
    
    if (!testimonyImage) {
        return res.status(400).json({ message: "Image is required" });
      }

    try{
        const newTestimony = new testimonials({
            testimonyUserName,vehicleName,testimonyMessage,testimonyImage,rating
        })
        await newTestimony.save()
        res.status(200).json(newTestimony)
          

    }catch(err){
        res.status(406).json(err)
    }  
    
}  



// get added Tedtimonials

exports.getAddedTestimonials = async(req,res)=>{

    console.log("inside get added testimonials function");
   try{
    const getTestimony = await testimonials.find({ status: "approved" }).limit(5)
    res.status(200).json(getTestimony)

   }catch(err){
    res.status(406).json(err)
   }   
}



// get to testomiy admin

exports.getToAdminTestimonials = async(req,res)=>{

    console.log("inside getToAdminTestimonials function");

   try{

    const getToAdminestimony = await testimonials.find().sort({ createdAt: -1 });
    res.status(200).json(getToAdminestimony)

   }catch(err){
    res.status(406).json(err)
   }  
}



// approve testimonial
exports.approveTestimonial = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ message: "Missing testimonial ID" });
    }
  
    try {
      const updatedTestimonial = await testimonials.findByIdAndUpdate(
        id,
        { status: "approved" },
        { new: true }
      );
  
      if (!updatedTestimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
  
      res.status(200).json(updatedTestimonial);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };
  
  




  

// delete testimonials 

exports.deleteAddedTestimonials = async(req,res)=>{
    console.log("inside delete a testimonials function");

    const {id}= req.params
    try{

        const deleteTestimony = await testimonials.findByIdAndDelete(id)
        res.status(200).json(deleteTestimony)
    }catch(err){
        res.status(406).json(err)
    }
    
    
}