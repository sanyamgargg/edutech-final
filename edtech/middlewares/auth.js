const jwt = require("jsonwebtoken") ;
require("dotenv").config();
const User = require("../models/User") ;

/* ---------------- Auth ---------------- */
exports.auth = async(req,res,next)=>{
    try {
        // 1.Extract Token
        const token = res.cookies.token 
                        || res.body.token
                        || res.header("Authorisation").replace("Bearer","");
        // 2. If token is missing then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is Missing"
            })
        }
        //3. Verify the token
        try {
            const decode = await jwt.verify(token,process.env.JWT_SECRET) ;
            console.log(decode) ;
            req.user = decode;
        } catch (error) {
            //Verification Issue
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            })
            
        }
        next() ;

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while validating the token"
        })
    }
}
/* ---------------- isStudent ---------------- */

exports.isStudent = async(req,res,next)=> {
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This route is protected only for students"
            })
            next() ;
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:"User role cannot be verified, Please Try Again"
        })
        
    }
}
/* ---------------- isInstructor ---------------- */
exports.isInstructor = async(req,res,next)=>{
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This route is protected only for Instructor"
            })
            next() ;
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:"User role cannot be verified, Please Try Again"
        })
        
    }
}
/* ---------------- isAdmin ---------------- */
exports.isAdmin = async(req,res,next)=>{
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This route is protected only for Admin"
            })
            next() ;
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:"User role cannot be verified, Please Try Again"
        })
        
    }
}
