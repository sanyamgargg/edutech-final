const User = require("../models/User") ;
const mailSender = require("../utils/mailSender") ;
const bcrypt = require("bcrypt")


/* -------------------- resetPasswordToken ------------------------ */
exports.resetPasswordToken = async(req,res) => {
    try {
        // 1. get email from body
        const email = req.body.email ;
        // 2. check user for this email
        const user = await User.findOne({email}) ;
        if(!user){
            return res.status({
                success: false,
                message: "No user was found with this mail."
            })
        }
        // 3. generate token
        const token = crypto.randomUUID() ;
        // 4. update user by adding token and expiration date
        const updatedToken = await User.findOneAndUpdate({email:email},{
            token: token,
            resetPasswordExpiration: Date.now() + 5*60*1000,
        },{new:true})
        // 5. create url
        const url = `http://localhost:3000/update-password/${token}` ;
        
        // 6. send email containing the url
        await mailSender(email,
            "Password Reset Link",
            `Password Reset Link: ${url}`)

        // 7. return response
        return res.json({
            sucess: true,
            message: "Reset link was successfully sent to user."
        })
    } catch (error) {
        console.log(error) ;
        return res.status.json({
            sucess: false,
            message: "An error occured while send the mail: "
        })
        
        
    }
}

/* -------------------- resetPasswordToken ------------------------ */
exports.resetPassword = async(req,res) => {
    try {
        //1. data fetch
        const {password, confirmPassword, token} = req.body ;
        //2. validation
        if(password !== confirmPassword){
            return res.status(401).json({
                success: false,
                message: "Password enteries doesnot match"
            })
        }
        //3. get userdetails from the existing token
        const userdetails = await User.findOne({token:token}) ;
        //4. if no entry - invalid token
        if(!userdetails){
            return res.status({
                success: false,
                message: "Token is invalid"
            })
        }
        //5. token time check
        if(userdetails.resetPasswordExpiration < Date.now()){
            return res.status({
                success: false,
                message: "Token time expired."
            })
        }
        //6. hash password
        const hashedPassword = await bcrypt.hash(password,10) ;
        //7. password update
        await User.findOneAndUpdate({token:token},
            {password: hashedPassword},
            {new: true} 
        )
        //8. return response
        return res.status(200).json({
            sucess: true,
            message: "Password reset successfully"
        })
    } catch (error) {
        console.log(error) ;
        return res.status(500).json({
            success: true,
            message: "An error occured while reseting the password."
        })
        
    }
}