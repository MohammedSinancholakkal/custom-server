const Booked  = require('../Model/bookedServicesSchema')
const sendEmail = require("./sendEmail"); // adjust path if needed


// addBookedServices

exports.AddBookedServices = async(req,res)=>{
    console.log("inside addd booked services function");

    const {bookedName,bookedEmail,bookedPhoneNo,bookedMessage}= req.body

    try{
        const addBooked = new Booked({
            bookedName,bookedEmail,bookedPhoneNo,bookedMessage
        })

        await addBooked.save()
        res.status(200).json(addBooked)

    }catch(err){
        res.status(401).json(err)
    }
    
}



//get Bokked services

exports.getBookedServices = async(req,res)=>{
    console.log("inside getbooked services function");

    try {    
    const getServices = await Booked.find().sort({ createdAt: -1 });
    res.status(200).json(getServices)
    } catch (err) {
        res.status(406).json(err)        
    }   
}





// confirm services
exports.confirmService = async (req, res) => {
  const { id } = req.params;

  try {
    // update status in DB
    const service = await Booked.findByIdAndUpdate(
      id,
      { status: "confirmed", isConfirmed: true },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // generate current date & time
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-IN");
    const formattedTime = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // subject & plain text fallback for customer
    const subject = "✅ Booking Confirmed - Custom Rodz";
    const text = `Hello ${service.bookedName},

We are delighted to let you know that your booking has been confirmed! 🎉

📅 Date: ${formattedDate}
⏰ Time: ${formattedTime}

Booking Details:
- Name: ${service.bookedName}
- Email: ${service.bookedEmail}
- Phone: ${service.bookedPhoneNo}
- Message: ${service.bookedMessage || "N/A"}

We truly appreciate your trust in us and look forward to serving you with the best care possible.  
Thank you for choosing Custom Rodz! 🚗
`;

    // interactive HTML email with logo (for customer)
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9fbfd; border-radius: 10px; border: 1px solid #ddd; max-width: 600px; margin: auto;">
        <div style="text-align: center; margin-bottom: 20px;">
         


          <h2 style="color: #0d6efd; margin: 0;">Booking Confirmed ✅</h2>
        </div>

        <p style="font-size: 16px; color: #333;">Hello <b>${service.bookedName}</b>,</p>

        <p style="font-size: 15px; color: #333; line-height: 1.6;">
          We are delighted to inform you that your booking has been successfully <b>confirmed</b>! 🎉<br/><br/>
          Below are your booking details:
        </p>

        <div style="background: #eef6ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="margin: 5px 0;"><b>📅 Date:</b> ${formattedDate}</p>
          <p style="margin: 5px 0;"><b>⏰ Time:</b> ${formattedTime}</p>
          <p style="margin: 5px 0;"><b>👤 Name:</b> ${service.bookedName}</p>
          <p style="margin: 5px 0;"><b>📧 Email:</b> ${service.bookedEmail}</p>
          <p style="margin: 5px 0;"><b>📞 Phone:</b> ${service.bookedPhoneNo}</p>
          <p style="margin: 5px 0;"><b>📝 Message:</b> ${service.bookedMessage || "N/A"}</p>
        </div>

        <p style="font-size: 15px; color: #333; line-height: 1.6;">
          We truly appreciate your trust in <b>Custom Rodz</b>. Our team is excited to serve you and ensure the best experience possible. 🙏✨
        </p>

        <hr style="margin: 20px 0;"/>
        <p style="font-size: 13px; color: #666; text-align: center;">
          This is an automated message from <b>Custom Rodz</b>.  
          For queries, please contact us at <a href="mailto:${process.env.EMAIL_USER}" style="color: #0d6efd;">${process.env.EMAIL_USER}</a>.
        </p>
      </div>
    `;

    // send email to customer
    await sendEmail(service.bookedEmail, subject, text, htmlContent);

    // polite + formatted HTML for admin
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #fff8e1; border: 1px solid #ffeeba; border-radius: 8px; max-width: 600px; margin:auto;">
        <div style="text-align: center; margin-bottom: 15px;">
          <img src="https://i.ibb.co/qFHRQ8k/custom-rodz-logo.png" alt="Custom Rodz Logo" style="width: 100px; margin-bottom: 10px;" />
          <h2 style="color:#d9534f; margin:0;">🚨 New Booking Confirmed</h2>
        </div>

        <p style="font-size:15px; color:#333; line-height:1.6;">
          Dear <b>Custom Rodz Admin</b>,<br/><br/>
          We’re pleased to notify you that a new booking has been <b>successfully confirmed</b>.  
          Please review the details below and prepare to deliver the best service experience possible. 🙏✨
        </p>

        <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <p style="margin: 6px 0;"><b>👤 Customer:</b> ${service.bookedName}</p>
          <p style="margin: 6px 0;"><b>📅 Date:</b> ${formattedDate}</p>
          <p style="margin: 6px 0;"><b>⏰ Time:</b> ${formattedTime}</p>
          <p style="margin: 6px 0;"><b>📧 Email:</b> ${service.bookedEmail}</p>
          <p style="margin: 6px 0;"><b>📞 Phone:</b> ${service.bookedPhoneNo}</p>
          <p style="margin: 6px 0;"><b>📝 Message:</b> ${service.bookedMessage || "N/A"}</p>
        </div>

        <p style="font-size:14px; color:#333; line-height:1.6;">
          Thank you for your continued dedication in making <b>Custom Rodz</b> the trusted choice for our customers. 🚗💙  
          Please ensure smooth coordination for this confirmed booking.
        </p>

        <hr style="margin:20px 0;"/>
        <p style="font-size:12px; color:#666; text-align:center;">
          This is an automated message for the admin team.  
          If you need assistance, contact <a href="mailto:${process.env.EMAIL_USER}" style="color:#0d6efd;">${process.env.EMAIL_USER}</a>.
        </p>
      </div>
    `;

    await sendEmail(
      process.env.EMAIL_USER,
      "🚨 New Booking Confirmed",
      `Booking confirmed for ${service.bookedName} on ${formattedDate} at ${formattedTime}.
      
Details:
- Email: ${service.bookedEmail}
- Phone: ${service.bookedPhoneNo}
- Message: ${service.bookedMessage || "N/A"}`,
      adminHtml // ✅ polished polite HTML
    );

    res.status(200).json({
      message: "Service confirmed & confirmation email sent ✅",
      service,
    });
  } catch (err) {
    console.error("❌ Error in confirmService:", err);
    res.status(500).json({ error: err.message });
  }
};







// get confirmed services only

exports.getConfirmedServices = async (req, res) => {
    try {
      const confirmedServices = await Booked.find({ status: "confirmed" }).sort({ createdAt: -1 }); // 👈 match with confirmService
      res.status(200).json(confirmedServices);
    } catch (err) {
      res.status(500).json({
        message: "Error fetching confirmed services",
        error: err,
      });
    }
  };
  




// delete confirmed Services

// delete confirmed Services
exports.deleteConfirmedServices = async (req, res) => {
    console.log("inside delete confirmed services function");
  
    const { id } = req.params;
  
    try {
      // Instead of deleting the whole booking, just reset it
      const updated = await Booked.findByIdAndUpdate(
        id,
        { status: "pending", isConfirmed: false }, // 👈 reset
        { new: true }
      );
  
      if (!updated) {
        return res.status(404).json({ message: "Service not found" });
      }
  
      res.status(200).json({
        message: "Service removed from confirmed list (still in booked list)",
        updated,
      });
    } catch (err) {
      res.status(406).json(err);
    }
  };
  
  
  




// delete booked services
exports.deleteABookedServices = async (req, res) => {
  console.log("inside delete a booked services function");

  const { id } = req.params;
  try {
    // find the booked service first
    const service = await Booked.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // send rejection email
    const subject = "❌ Booking Rejected - Custom Rodz";
    const text = `Hi ${service.bookedName},

We regret to inform you that your booking has been rejected due to some issues.  
Please reach out to Custom Rodz as soon as possible to discuss the details.  

We value your interest and look forward to assisting you.  

Thanks for your cooperation. 🙏✨  

- Custom Rodz Team 🚗
`;

    await sendEmail(service.bookedEmail, subject, text);

    // delete the service from DB
    const deleteBooked = await Booked.findByIdAndDelete(id);

    res.status(200).json({
      message: "Service deleted & rejection email sent ✅",
      deleted: deleteBooked,
    });

  } catch (err) {
    console.error("❌ Error in deleteABookedServices:", err);
    res.status(500).json({
      success: false,
      message: "Server error while deleting service",
      error: err,
    });
  }
};

    




    
