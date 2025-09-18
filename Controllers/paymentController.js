// controllers/orderController.js
const crypto = require("crypto");
const razorpay = require("../Config/razorpay");
const Order = require("../Model/paymentSchema");
const nodemailer = require("nodemailer");


// Create Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, customerAddress, cartItems, totalAmount } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty or invalid" });
    }

    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
    }

    // 1️⃣ Create Razorpay order (amount in paisa)
    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100, // amount in paisa
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });
    } catch (err) {
      console.error("Razorpay create order error:", err);
      return res.status(500).json({ success: false, message: "Razorpay order creation failed", error: err.message });
    }

    // 2️⃣ Map cart items safely
    const items = cartItems.map((item) => {
      if (!item.productId || !item.quantity) {
        throw new Error("Invalid cart item structure");
      }
    
      const price = item.productId.offerPrice || item.productId.price || 0;
    
      return {
        productId: item.productId._id,
        productName: item.productId.productName,
        quantity: item.quantity,
        price,
        total: price * item.quantity,
        productImage: item.productId.productImage || "no-image.jpg", // ✅ Fix added
      };
    });
    

    // 3️⃣ Save order in DB
    const order = new Order({
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      items,
      totalAmount,
      currency: "INR",
      razorpayOrderId: razorpayOrder.id,
      userId: req.userId,
      status: "Pending",
      paymentStatus: "Pending",
    });

    await order.save();

    // 4️⃣ Return order details to frontend
    res.status(200).json({
      success: true,
      orderId: order._id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      razorpayOrderId: razorpayOrder.id,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ success: false, message: "Failed to create order", error: err.message });
  }
};



// Verify Razorpay payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment data" });
    }

    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
    }

    // 1️⃣ Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // 2️⃣ Find order for this user
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id, userId: req.userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found or not authorized" });
    }

    // 3️⃣ Update order
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.paymentStatus = "Paid";
    order.status = "Confirmed";

    await order.save();

    res.status(200).json({ success: true, message: "Payment verified successfully", order });

  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ success: false, message: "Payment verification failed", error: err.message });
  }
};



// get payment

// Get all payments/orders
exports.getPayments = async (req, res) => {
  try {
    console.log("Fetching all payments/orders...");
    
    const payments = await Order.find().populate('items.productId').sort({ createdAt: -1 });

    if (!payments || payments.length === 0) {
      return res.status(404).json({ success: false, message: "No payments found" });
    }

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });

  } catch (err) {
    console.error("Get payments error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: err.message,
    });
  }
};







// ✅ Send Confirmation Email

exports.sendConfirmationEmail = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order ID required" });
    }

    // Find the order in DB
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your SMTP provider
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    // Prepare product details
    const productList = order.items
      .map(
        (item) =>
          `${item.productName} (x${item.quantity}) - ₹${item.total}`
      )
      .join("\n");

    // Email content
    const mailOptions = {
      from: `"Custome Rodz" <${process.env.EMAIL_USER}>`,
      to: order.customerEmail,
      subject: "Order Confirmation - Custome Rodz",
      text: `Hi ${order.customerName},\n\nYour payment was successful! 🎉\n\nOrder Summary:\n${productList}\n\nTotal: ₹${order.totalAmount}\n\nYour order will be delivered soon!\n\nThank you for shopping with us.\n\n- Custome Rodz`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Confirmation email sent!" });
  } catch (err) {
    console.error("Email sending error:", err);
    res.status(500).json({ success: false, message: "Failed to send email", error: err.message });
  }
};







// delete order (Admin only)

exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({ success: false, message: "Failed to delete order", error: err.message });
  }
};




// ✅ Get all orders for a specific user



exports.getMyOrders = async (req, res) => {
  try {
    // userId will come from JWT auth (req.user.id) or params/query
    const userId = req.userId

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const orders = await Order.find({ userId })
      .populate("items.productId", "name price image") // optional populate
      .sort({ createdAt: -1 }); // newest first

    if (!orders.length) {
      return res.status(200).json({ success: true, orders: [] });
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




