const nodemailer = require('nodemailer');
require('dotenv').config()





const sendEmail = async (to, subject, text, html = null) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your SMTP service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Custom Rodz" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,   // plain text fallback
      html,   // 👈 this enables styled HTML email
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;





// console.log("Email User:", process.env.EMAIL_USER);
// console.log("Email Pass:", process.env.EMAIL_PASS);



