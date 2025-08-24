const User = require("../models/User") ;
const Otp = require("../models/Otp") ;
const otpGenerator = require("otp-generator") ;
const bcrypt = require("bcrypt") ;
const Profile = require("../models/Profile");
require("dotenv").config() ;
const jwt = require("jsonwebtoken") ;
const sendOtpEmail = require("../utils/mailTemplate/sendOtp");




/* -------------------------- sendOtp -------------------------------*/
exports.sendOTP = async (req,res)=>{
   try {
     // first set take email from body
     const {email} = req.body ;

     // make a function to check if user already exist
     const checkUserPresent = await User.findOne({email}) ;
     if(checkUserPresent){
         return res.status(401).json({
             success:false,
             message:"User Already Exist" 
         })
     }
     //generate otp
     let otp = otpGenerator.generate(6,{
        upperCaseAlphabets: false ,
        lowerCaseAlphabets: false,
        specialChars: false
     });
     console.log("Otp Generated: ",otp) ;

     //check if otp already exist
     let result = await Otp.findOne({otp:otp}) ; 
     while(result){
        otp = otpGenerator.generate(6,{
            upperCaseAlphabets: false ,
            lowerCaseAlphabets: false,
            specialChars: false
         });
         result = await Otp.findOne({otp:otp}) ;
     }
     
     //Otp ki entry in DB
     const otpayload = {email,otp} ;
     const otpbody = await Otp.create(otpayload) ;
     console.log(otpbody) ; 

    const sendingOtp = await sendOtpEmail(email,email,otp)
    .then(info => console.log('Email sent successfully:', info))
    .catch(error => console.error('Error sending email:', error));
    
     //success status
     res.status(200).json({
        success:true,
        message:"Otp sent successfully",
        otp
     })
   } catch (error) {
    console.log(error) ;
    return res.status(500).json({
        success: false,
        message: error.message
    })
   }
} ; 

/* -------------------------- signUp -------------------------------*/
exports.signup = async (req, res) => {
    try {
        // Fetch data from req.body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            contactNumber,
            accountType,
            otp
        } = req.body;

        // Validate input data (make OTP optional for demo)
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "All input fields are required"
            });
        }

        // Match both passwords
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirmed password do not match"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // For demo purposes, skip OTP verification if not provided
        if (otp) {
            // Find the most recent OTP shared to the user
            const recentOtp = await Otp.findOne({ email }).sort({ createdAt: -1 }).exec();
            console.log(recentOtp);

            // Validate OTP
            if (!recentOtp) {
                return res.status(400).json({
                    success: false,
                    message: "Otp not found"
                });
            } else if (recentOtp.otp !== otp) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Otp"
                });
            }
        }

        // Hash Passwords
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Entry in DB
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            accountDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        });

        // Return response
        return res.status(200).json({
            success: true,
            message: "User registered Successfully",
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered, Please try again."
        });
    }
};


/* -------------------------- login -------------------------------*/
exports.login = async (req, res) => {
    try {
        // 1. Get data from req body
        const { email, password } = req.body;

        // 2. Validate data
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            });
        }

        // 3. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered, please sign up"
            });
        }

        // 4. Check if user has a password
        if (!user.password) {
            return res.status(400).json({
                success: false,
                message: "Password is required"
            });
        }

        // 5. Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }

        // 6. Generate JWT
        const payload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h"
        });

        // 7. Set user token
        user.token = token;
        user.password = undefined; // Remove password from the response

        // 8. Create cookie and send response
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        };
        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: "Logged in successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User can't be logged in, please try again"
        });
    }
};
 
/* -------------------------- changePassword -------------------------------*/
exports.changePassword = async (req, res) => {
    try {
        // Extract data from request body
        const { email, currentPassword, newPassword, confirmNewPassword } = req.body;

        // Validate input data
        if (!email || !currentPassword || !newPassword || !confirmNewPassword) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if new passwords match
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirm new password do not match"
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User does not exist"
            });
        }

        // Validate current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password in the database
        user.password = hashedNewPassword;
        await user.save();

        // Send success response
        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Could not change password, please try again"
        });
    }
};
