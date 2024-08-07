const mongoose = require('mongoose') ;
const {Schema} = require('mongoose') ;
const mailSender = require('../utils/mailSender');

const otpSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    otp:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires: 20*60

    }
})

// a function to send mail

// async function sendMailVerification(email,otp){
//     try {
//         const mailResponse = await mailSender(email,"Verification mail from EduTech",otp);
//         console.log("Email Sent Successfully: ",mailResponse)
//     } catch (error) {
//         console.log("Error Occured while sending mail") ;
//         throw error ;
//     }
// }

// //pre middleware
// otpSchema.pre("save",async function(next){
//     await sendMailVerification(this.email,this.otp) ;
// })

module.exports = mongoose.model("Otp",otpSchema) ;