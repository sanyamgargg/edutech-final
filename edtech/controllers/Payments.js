const { default: mongoose } = require("mongoose");
const {instance} = require("../config /razorpay") ;
const Course = require("../models/Course") ;
const User = require("../models/User") ;

const sendPaymentConfirmationEmail = require("../utils/mailTemplate/paymentConfirmation");


exports.capturePayments = async(req,res)=>{
    try {
        //1. Get courseId and get userId 
        const course_Id = req.body ;
        const user_Id = req.user.id ;
        //2. validation
        //3. valid courseId
        if(!course_Id){
            return res.status(401).json({
                success: false,
                message: "Please provide valid course Id"
            })
        }
        //4. valid courseDetails
        let course ;

        try {
            course = await Course.findById(course_Id) ;
            if(!course){
                return res.json({
                    success:false,
                    message:"Course not found"
                })
            }
             //5. user Already pay for the same course
        const uid = mongoose.Types.ObjectId(user_Id) ;
        if(course.studentEnrolled.includes(uid)){
            return res.json({
                success: false,
                message: "User has already enrolled in the course."
            })
        }
        } catch (error) {
            console.log(error)
            return res.json({
                success:false,
                message: error.message
            })
        }
       
        //6. order create
        const amount = course.price ;
        const currency = "INR" ;
        const options = {
            amount: amount*100 ,
            currency: currency ,
            receipt: Math.random(Date.now()).toString() ,
            notes: {
                courseId: course_Id,
                userId: user_Id
            }
        }

        try {
            const paymentResponse = await instance.orders.create(options);
            console.log(paymentResponse) ;
            //7. return resonse
            return res.json({
                success: true,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                thumbnail: course.thumbnail,
                orderId: paymentResponse.id,
                currency: paymentResponse.currency,
                amount: paymentResponse.amount

            })
        } catch (error) {
             return res.json({
                success: false,
                message: error.message
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// verify Signature

exports.verifySignature = async(req,res)=>{
    const webHookSecret = "12345678" ;

    const signature = req.headers("x-razorpay-signature") ;

    const shasum = crypto.createHmac("sha256",webHookSecret) ;
    shasum.update(JSON.stringify(req.body)) ;
    const digest = shasum.digest("hex") ;

    if(signature === digest){
        console.log("Payment is authorized") ;

        try {
            const {course_id , user_id} = req.body.payload.payments.entity.notes ;
            // find the course and update student enrolled in it.
            const enrolledCourse = await Course.findByIdAndUpdate({_id: course_id},
                                                                    {
                                                                        $push: {
                                                                            studentEnrolled: user_id,
                                                                        },
                                                                        
                                                                    },
                                                                    {new:true}
            )
            if(!enrolledCourse){
                return res.json({
                    success:false,
                    message:"Course not found!"
                })
            }
            console.log(enrolledCourse) ;
            // find the student and updats the course list.
            const enrolledStudent = await User.findByIdAndUpdate({_id:user_id},
                                                                        {
                                                                            $push:{
                                                                                courses:course_id
                                                                            }
                                                                        },
                                                                        {new:true}
            )
            console.log(enrolledStudent) ;

            //mail send krdo
            const emailResponse = await sendPaymentConfirmationEmail(enrolledStudent.email,enrolledStudent.firstName,enrolledCourse.courseName)

            console.log(emailResponse) ;

            return res.status(200).json({
                success: true,
                message: "Signature verified and student enrolled"
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
    else{
        return res.status(400).json({
            success: false,
            message: "Invalid response"
        })
    }
}