const {login,signup,sendOTP,changePassword} = require("../controllers/Auth") ;
const {resetPasswordToken,resetPassword} = require("../controllers/ResetPassword")
const { auth } = require("../middlewares/auth");


const express = require("express") ;
const router = express.Router() ;
    
    // Routes for Login, Signup, and Authentication
/* ---------------------- Authentication Routes ------------------*/
    
    // Route for user login
    router.post("/login",login)
   
    // Route for user signup
    router.post("/signup",signup)
    
    // Route for sending OTP to the user's email
    router.post("/sendotp",sendOTP)
   
    // Route for Changing the password
    router.post("/changepassword",auth,changePassword)

/* ---------------------- ResetPassword Routes ------------------*/
    router.post("/reset-password-token",resetPasswordToken) ;

    router.post("/reset-password",resetPassword) ;



    module.exports = router ;