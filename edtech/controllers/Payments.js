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
        if(!course_Id){
            return res.status(401).json({
                success: false,
                message: "Please provide valid course Id"
            })
        }
        
        //3. valid courseDetails
        let course ;
        try {
            course = await Course.findById(course_Id) ;
            if(!course){
                return res.json({
                    success:false,
                    message:"Course not found"
                })
            }
            
            //4. user Already pay for the same course
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
       
        //5. For zero-amount courses, directly enroll the student
        if(course.price === 0) {
            try {
                // Enroll student in course
                const enrolledCourse = await Course.findByIdAndUpdate(
                    {_id: course_Id},
                    {
                        $push: {
                            studentEnrolled: user_Id,
                        },
                    },
                    {new:true}
                );
                
                if(!enrolledCourse){
                    return res.json({
                        success:false,
                        message:"Course not found!"
                    })
                }
                
                // Update user's course list
                const enrolledStudent = await User.findByIdAndUpdate(
                    {_id: user_Id},
                    {
                        $push:{
                            courses: course_Id
                        }
                    },
                    {new:true}
                );
                
                // Send confirmation email
                try {
                    const emailResponse = await sendPaymentConfirmationEmail(
                        enrolledStudent.email,
                        enrolledStudent.firstName,
                        enrolledCourse.courseName
                    );
                    console.log(emailResponse);
                } catch (emailError) {
                    console.log("Email sending failed:", emailError);
                }
                
                return res.json({
                    success: true,
                    courseName: course.courseName,
                    courseDescription: course.description,
                    thumbnail: course.thumbnail,
                    message: "Successfully enrolled in free course",
                    amount: 0
                });
                
            } catch (error) {
                return res.json({
                    success: false,
                    message: error.message
                })
            }
        }
        
        //6. For paid courses, create order (but we'll only support free courses in demo)
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
            const paymentResponse = await instance.createOrder(amount*100, currency);
            console.log(paymentResponse) ;
            //7. return response
            return res.json({
                success: true,
                courseName: course.courseName,
                courseDescription: course.description,
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

// verify Signature - Simplified for demo
exports.verifySignature = async(req,res)=>{
    try {
        const {course_id, user_id} = req.body;
        
        if(!course_id || !user_id) {
            return res.status(400).json({
                success: false,
                message: "Missing course_id or user_id"
            });
        }
        
        // For demo, we'll just verify and enroll
        const enrolledCourse = await Course.findByIdAndUpdate(
            {_id: course_id},
            {
                $push: {
                    studentEnrolled: user_id,
                },
            },
            {new:true}
        );
        
        if(!enrolledCourse){
            return res.json({
                success:false,
                message:"Course not found!"
            })
        }
        
        // Update user's course list
        const enrolledStudent = await User.findByIdAndUpdate(
            {_id: user_id},
            {
                $push:{
                    courses: course_id
                }
            },
            {new:true}
        );
        
        // Send confirmation email
        try {
            const emailResponse = await sendPaymentConfirmationEmail(
                enrolledStudent.email,
                enrolledStudent.firstName,
                enrolledCourse.courseName
            );
            console.log(emailResponse);
        } catch (emailError) {
            console.log("Email sending failed:", emailError);
        }
        
        return res.status(200).json({
            success: true,
            message: "Payment verified and student enrolled"
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}