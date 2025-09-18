
const Quote = require('../Model/quoteSchema')
const sendEmail = require("./sendEmail"); // adjust path if needed



// add quote

exports.AddQuote = async(req,res)=>{
    console.log("inside add quote function");

    const {quoteName,quoteEmail,quoteBikeModel,quoteMessage} = req.body

    try{
        const newQuote = new Quote({
            quoteName,quoteEmail,quoteBikeModel,quoteMessage
        })
        await newQuote.save()
        res.status(200).json(newQuote)

    }catch(err){
        res.status(500).json({ success: false, message: "Server error while adding quote", error: err });
    }
    
}



// get added quote 


exports.getQuote = async(req,res)=>{
    console.log("inside get quote function");
    try{
        const getAddedQuote = await Quote.find().sort({ createdAt: -1 });
        res.status(200).json(getAddedQuote)
    }catch(err){
        res.status(500).json({ success: false, message: "Server error while getting quote", error: err });    }  
}


//delete a quote

exports.deleteAQuote = async(req,res)=>{
console.log("inside delete a quote function");

const {id}=req.params

try{
    const deleteASingleQuote = await Quote.findByIdAndDelete(id)
    res.status(200).json(deleteASingleQuote)

}catch(err){
    res.status(500).json({ success: false, message: "Server error while deleting quote", error: err });
    }  
}



// confirm quote

exports.confirmQuote = async(req,res)=>{
    console.log("inside confirm quote section");

    const {id}=req.params

   try{
    const quote = await Quote.findByIdAndUpdate(
        id,
        { status: "confirmed", isConfirmed: true },
        { new: true }
    )
    if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
        // send confirmation email
    await sendEmail(
        quote.quoteEmail,
        "Quote Confirmation - Custom Rodz",
        `Hello ${quote.quoteName},\n\n✅ Your free quote request for ${quote.quoteBikeModel} has been confirmed.\n\nMessage: ${quote.quoteMessage}\n\nWe will reach out to you soon.\n\nThank you for choosing Custom Rodz! 🚀`
      );
  
      res.status(200).json({ message: "Quote confirmed & email sent", quote });

   }catch(err){
    res.status(406).json(err)
   }
    
}





// ❌ Reject a Quote + Send Email (optional)

exports.rejectQuote = async (req, res) => {
    const { id } = req.params;
  
    try {
      const quote = await Quote.findByIdAndUpdate(
        id,
        { status: "rejected", isConfirmed: false },
        { new: true }
      );
  
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
  
      // send rejection email
      await sendEmail(
        quote.quoteEmail,
        "Quote Rejected - Custom Rodz",
        `Hello ${quote.quoteName},\n\n❌ Unfortunately, your quote request for ${quote.quoteBikeModel} has been rejected.\n\nMessage: ${quote.quoteMessage}\n\nPlease contact us for further assistance.\n\n- Custom Rodz`
      );
  
      res.status(200).json({ message: "Quote rejected & email sent", quote });
    } catch (error) {
      res.status(500).json({ message: "Error rejecting quote", error });
    }
  };
  



// 📌 (Optional) Get confirmed quotes only

exports.getConfirmedQuotes = async (req, res) => {
    try {
      const confirmedQuotes = await Quote.find({ status: "confirmed" });
      res.status(200).json(confirmedQuotes);
    } catch (error) {
      console.error("Error fetching confirmed quotes:", error.message);
      res.status(500).json({ message: "Error fetching confirmed quotes" });
    }
  };
  