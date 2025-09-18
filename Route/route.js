const express = require('express')
const router = express.Router()
const userController = require('../Controllers/controllers')
const productController = require('../Controllers/productController')
const jwtMiddilware = require('../middleware/jwtMiddileware')
const multerConfig = require('../middleware/multer')
const testimonyController = require('../Controllers/testimonyController')
const quoteController = require('../Controllers/quoteController')
const bookedServicesController = require('../Controllers/bookedServicesController')
const BannerController  = require('../Controllers/BnnerController')
const wishlistController = require('../Controllers/wishlistController')
const cartController = require('../Controllers/cartController')
const paymentController = require('../Controllers/paymentController')
const billingController = require('../Controllers/billingController')


//register

router.post('/register',userController.Register)


//login

router.post('/login',userController.Login)


// Forgot Password
// router.post('/forgot-password', userController.ForgotPassword);



// =============== products section ==============

//GetHomeProducts
router.get("/products/home", productController.getHomeProducts);
// router.get('/home-product',productController.GetHomeProducts)


//toHomeproducts 
router.put("/products/:id/tohome", jwtMiddilware, productController.addProductToHome);



//GetAllProducts

router.get('/all-product',productController.GetAllProducts)


//GetDisplayHomeProducts  

router.get('/display-home-product',productController.GetHomeDisplayProducts)



//add-product
//router specific middilware

router.post('/add-product',jwtMiddilware,multerConfig.single('productImage'),productController.AddProduct)


//EditProducts

router.put('/edit-products/:pid',jwtMiddilware,multerConfig.single('productImage'),productController.EditProducts)


//DeleteProducts

router.delete('/delete-products/:pid', jwtMiddilware, productController.DeleteProduct)


// remove from home

router.patch('/remove-from-home/:id',productController.removeFromHome);





// testimonials section ============================//



//addTestimony

router.post('/add-testimony',multerConfig.single('testimonyImage'), testimonyController.AddTestimonials)


//getTestimony

router.get('/get-testimony', testimonyController.getAddedTestimonials)

//getToAdminestimony

router.get('/get-admin-testimony', testimonyController.getToAdminTestimonials)



// approve testimony

router.patch("/testimonial-status/:id",jwtMiddilware,testimonyController.approveTestimonial);


//deleteTestimony

router.delete('/delete-testimony/:id', testimonyController.deleteAddedTestimonials)




// quote section ============================//


// addQuote

router.post('/add-quote',jwtMiddilware, quoteController.AddQuote)


// getQuote

router.get('/get-quote', quoteController.getQuote)


// deleteQuote

router.delete('/delete-quote/:id',jwtMiddilware, quoteController.deleteAQuote)


// ✅ Confirm a quote
router.put("/quotes/confirm/:id",jwtMiddilware, quoteController.confirmQuote);



// ✅ Get all confirmed quotes
router.get("/quotes/confirmed", jwtMiddilware, quoteController.getConfirmedQuotes);


// reject quote

router.put("/quotes/reject/:id", jwtMiddilware, quoteController.rejectQuote);









// ================ Booked services section ============================//


// add booked services

router.post('/add-booked-services',jwtMiddilware, bookedServicesController.AddBookedServices)


// get booked services

router.get('/get-booked-services', bookedServicesController.getBookedServices)







// confirm service (approve a booking by ID)
router.put("/booked/confirm/:id",jwtMiddilware, bookedServicesController.confirmService);




// 📌 Get only confirmed (approved) bookings

router.get("/booked/confirmed", bookedServicesController.getConfirmedServices);



// 📌 delete only confirmed (approved) bookings

router.delete("/delete/confirmed/:id",jwtMiddilware, bookedServicesController.deleteConfirmedServices);


// delete booked services

router.delete('/delete-services/:id', bookedServicesController.deleteABookedServices)







// =============  Homebanner =================//

// addHomeBanner 

router.post('/add-home-banner',jwtMiddilware,multerConfig.single('bannerImage'),BannerController.addHomeBanner)


// getHomeBanner 

router.get('/get-home-banner',BannerController.getHomeBanner)


// deleteHomeBanner 

router.delete('/delete-home-banner/:id',jwtMiddilware,BannerController.deleteHomebanner)



// getBannertoHome 

router.get('/get-banner-tohome',BannerController.getBannerToHome)






//=============== productbanner ====================//

// addProductBanner 

router.post('/add-product-banner',jwtMiddilware,multerConfig.single('productBanner'),BannerController.addProductBanner)



// getProductBanner 

router.get('/get-product-banner',BannerController.getProductBanner)


// deleteProductBanner 

router.delete('/delete-product-banner/:id',jwtMiddilware,BannerController.deleteProductBanner)



// getBannertoProducts 

router.get('/get-banner-toproducts',BannerController.getProductBannerToProducts)




// ============= service banner ================//

// addServiceBanner 

router.post('/add-service-banner',jwtMiddilware,multerConfig.single('serviceBanner'),BannerController.addServiceBanner)


// getServiceBanner 

router.get('/get-service-banner',BannerController.getServiceBanner)


// deleteProductBanner 

router.delete('/delete-service-banner/:id',jwtMiddilware,BannerController.deleteServiceBanner)


// getBannertoServices 

router.get('/get-banner-toservices',BannerController.getServiceBannertoServices)









//  =============  Wishlist section  ================//

// add wishlist 

router.post("/add/wishlist/:productId", jwtMiddilware,wishlistController.addToWishlist );



// Get user wishlist

router.get("/get-wishlist", jwtMiddilware, wishlistController.getWishlist);




//remove wishlist

router.delete("/remove-wishlist/:productId", jwtMiddilware,wishlistController.removeFromWishlist);







//  ============= cart section  ==============//


// Add to cart

router.post("/add-cart", jwtMiddilware, cartController.addToCart);


// Get user cart

router.get("/get-cart", jwtMiddilware, cartController.getCart);

// Remove from cart

router.delete("/remove-cart/:productId", jwtMiddilware, cartController.removeFromCart);


// Update quantity

router.put("/update-cart-quantity", jwtMiddilware, cartController.updateCartQuantity);


// empty quantity

router.delete("/empty-cart", jwtMiddilware, cartController.emptyCart);



// ================  payment section     ===============//


// Create Razorpay order
router.post("/create-order", jwtMiddilware, paymentController.createOrder);

// Verify Razorpay payment
router.post("/verify-payment", jwtMiddilware, paymentController.verifyPayment); 


// GET all payments/orders (Admin)
router.get('/get-payments', jwtMiddilware, paymentController.getPayments);


// send email to ordered peoples
router.post("/send-confirmation-email", jwtMiddilware,paymentController.sendConfirmationEmail); 


// delete order

router.delete("/delete-order/:id", jwtMiddilware, paymentController.deleteOrder);


// Route to get logged-in user's orders

router.get("/my-orders", jwtMiddilware, paymentController.getMyOrders);




// ========  billing section  ===========



// get products to billing section
router.get("/all-product",billingController.GetAllProductsToBilling);



// add new customer route
router.post("/add-billing",jwtMiddilware,billingController.addBillingDetails);



// get customer billings 
router.get("/get-billing",jwtMiddilware,billingController.getAddedDetails);



// delete customer billings 
router.delete("/delete-billing/:id",jwtMiddilware,billingController.deleteAddedBillings);


// delete order of users  
router.delete("/delete-orders-users/:id",jwtMiddilware,billingController.deleteOrdersOfUsers);


// Update billing
router.put("/update-billing/:id", jwtMiddilware,billingController.updateBillingDetails);



module.exports = router   